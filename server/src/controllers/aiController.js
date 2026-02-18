const { callOpenAI } = require('../lib/openai');
const prisma = require('../lib/prisma');

// very simple in-memory rate limiter: { key -> [timestamps] }
const rateMap = new Map();
const RATE_LIMIT_COUNT = 6; // requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // per minute

function tooManyRequests(userId, action){
  const key = `${userId}:${action}`;
  const now = Date.now();
  const arr = rateMap.get(key) || [];
  // remove old
  const fresh = arr.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  fresh.push(now);
  rateMap.set(key, fresh);
  return fresh.length > RATE_LIMIT_COUNT;
}

function tryParseJsonBlock(text){
  try{
    const start = text.indexOf('{');
    if (start === -1) return null;
    const jsonString = text.substring(start);
    return JSON.parse(jsonString);
  }catch(e){ return null; }
}

async function handleGeneration(req, res, opts){
  try{
    const { taskId, notes } = req.body;
    const userId = req.user.id;
    if (!taskId || !notes) return res.status(400).json({ error: 'taskId and notes required' });
    if (tooManyRequests(userId, opts.type)) return res.status(429).json({ error: 'Rate limit exceeded, try again later' });

    const task = await prisma.task.findFirst({ where: { id: Number(taskId), userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const system = opts.system || 'You are an educational assistant that returns structured JSON when requested. Do NOT provide full assignment solutions or complete problem answers; instead, generate study aids, summaries, outlines, practice questions, and high-level guidance suitable for learning.';
    // Ensure model is instructed not to give full homework answers and to favor study material
    const userPrompt = opts.prompt(notes, task) + "\n\nImportant: do NOT provide full assignment answers or step-by-step solutions that would enable plagiarism. Focus on study aids, summaries, outlines, and practice questions appropriate for learning and revision.";

    let aiText;
    try{
      aiText = await callOpenAI(system, userPrompt, opts.maxTokens || 1000);
    }catch(err){
      // distinguish invalid API key
      if (String(err.message).toLowerCase().includes('openai_api_key')){
        return res.status(502).json({ error: 'OpenAI API key not configured on server' });
      }
      const payload = { error: 'OpenAI API error' };
      if (process.env.NODE_ENV === 'development') payload.details = err.message;
      return res.status(502).json(payload);
    }

    // try to parse JSON
    const parsed = tryParseJsonBlock(aiText);
    const stored = parsed ? JSON.stringify(parsed) : aiText;

    // save to DB
    const out = await prisma.aIOutput.create({ data: { taskId: Number(taskId), type: opts.type, content: stored } });

    res.json({ output: out, parsed: parsed || null, raw: aiText });
  }catch(err){
    console.error('AI controller error', err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function summary(req, res){
  return handleGeneration(req, res, {
    type: 'summary',
    prompt: (notes, task) => `Summarize the following notes into a concise study summary for college students, 3-6 short paragraphs. Be clear for ESL students. Notes:\n\n${notes}`,
  });
}

async function flashcards(req, res){
  return handleGeneration(req, res, {
    type: 'flashcards',
    prompt: (notes, task) => `Create 10 concise flashcards from these notes. Return strict JSON: {"flashcards": [{"q":"...","a":"..."}, ...]}. Notes:\n\n${notes}`,
  });
}

async function quiz(req, res){
  return handleGeneration(req, res, {
    type: 'quiz',
    prompt: (notes, task) => `Create a 10-question multiple-choice quiz from these notes. Return strict JSON: {"quiz":[{"q":"...","choices":["..."],"answer":0}, ...]}. Notes:\n\n${notes}`,
  });
}

async function studyPlan(req, res){
  return handleGeneration(req, res, {
    type: 'plan',
    prompt: (notes, task) => `Create a 7-day study plan tailored to the task titled "${task.title}" and these notes. Return strict JSON: {"plan":[{"day":1,"goal":"...","minutes":60}, ...]}. Notes:\n\n${notes}`,
  });
}

module.exports = { summary, flashcards, quiz, studyPlan };

// Lightweight endpoints for ad-hoc notes (AI Study Helper)
async function summarizeNotes(req, res) {
  try {
    const userId = req.user.id;
    const { notes } = req.body;
    if (!notes || String(notes).trim().length < 30) return res.status(400).json({ error: 'Notes must be at least 30 characters.' });
    if (tooManyRequests(userId, 'summarize')) return res.status(429).json({ error: 'Rate limit exceeded' });

    const system = 'You are an educational assistant. Provide a clear concise study summary appropriate for college students, suitable for ESL learners.';
    const userPrompt = `Summarize the following notes into a concise study summary (3 short paragraphs max). Notes:\n\n${notes}\n\nDo NOT provide full assignment answers. Focus on the core concepts and study tips.`;

    let aiText;
    try { aiText = await callOpenAI(system, userPrompt, 600); } catch (err) {
      console.error('OpenAI error', err.message || err);
      const payload = { error: 'OpenAI API error' };
      if (process.env.NODE_ENV === 'development') payload.details = err.message;
      return res.status(502).json(payload);
    }

    res.json({ summary: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function quizQuestions(req, res) {
  try {
    const userId = req.user.id;
    const { notes } = req.body;
    if (!notes || String(notes).trim().length < 50) return res.status(400).json({ error: 'Notes must be at least 50 characters.' });
    if (tooManyRequests(userId, 'quiz')) return res.status(429).json({ error: 'Rate limit exceeded' });

    const system = 'You are an educational assistant that produces multiple-choice practice questions.';
    const userPrompt = `From the notes below, create 5 multiple-choice quiz questions. Return JSON with an array named \"questions\": [{"q":"...","choices":["..."],"answer":0}, ...]. Notes:\n\n${notes}\n\nDo NOT provide full solutions, only short explanations if asked.`;

    let aiText;
    try { aiText = await callOpenAI(system, userPrompt, 800); } catch (err) {
      console.error('OpenAI error', err.message || err);
      const payload = { error: 'OpenAI API error' };
      if (process.env.NODE_ENV === 'development') payload.details = err.message;
      return res.status(502).json(payload);
    }

    // Try parse JSON block
    let parsed = null;
    try { parsed = tryParseJsonBlock(aiText); } catch(_) { parsed = null; }

    if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
      return res.json({ questions: parsed.questions });
    }

    // Fallback: attempt to extract lines as questions
    return res.json({ questions: [], raw: aiText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// export new handlers
module.exports = { summary, flashcards, quiz, studyPlan, summarizeNotes, quizQuestions };

