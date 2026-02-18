const prisma = require('../lib/prisma');
const { callOpenAI } = require('../lib/openai');

function safeJsonParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

async function createTask(req, res) {
  try {
    const { title, course, dueDate, notes } = req.body;
    if (!title || !notes) return res.status(400).json({ error: 'Title and notes required' });
    const task = await prisma.task.create({ data: { title, course, dueDate: dueDate ? new Date(dueDate) : null, notes, userId: req.user.id } });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create task' });
  }
}

async function listTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.user.id }, include: { outputs: true }, orderBy: { createdAt: 'desc' } });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not list tasks' });
  }
}

async function getTask(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const task = await prisma.task.findFirst({ where: { id, userId: req.user.id }, include: { outputs: true } });
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching task' });
  }
}

async function listOutputs(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    // ensure the task belongs to the authenticated user to prevent IDOR
    const task = await prisma.task.findFirst({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Not found' });
    const outputs = await prisma.aIOutput.findMany({ where: { taskId: id } });
    res.json(outputs.map(o => ({ ...o, parsed: safeJsonParse(o.content) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listing outputs' });
  }
}

async function markComplete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const task = await prisma.task.updateMany({ where: { id, userId: req.user.id }, data: { completed: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not mark complete' });
  }
}

async function generateOutput(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { action } = req.body; // summary | flashcards | quiz | plan
    if (!['summary','flashcards','quiz','plan'].includes(action)) return res.status(400).json({ error: 'Invalid action' });
    const task = await prisma.task.findFirst({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Build prompts
    const system = 'You are an educational assistant who converts unstructured notes into study aids for college students. Provide clear JSON for flashcards and quiz.';
    let userPrompt = '';

    if (action === 'summary') {
      userPrompt = `Summarize the following notes into a concise study summary (3-6 short paragraphs). Notes:\n\n${task.notes}`;
    } else if (action === 'flashcards') {
      userPrompt = `From the notes below, create 10 concise flashcards. Return JSON: {"flashcards": [{"q":"...","a":"..."}, ...]}. Notes:\n\n${task.notes}`;
    } else if (action === 'quiz') {
      userPrompt = `Create a 10-question quiz based on the notes. Return JSON: {"quiz": [{"q":"...","choices":["..."],"answer":1}, ...], "answers": [1,2,...]}. Provide plausible multiple choice options and mark the correct index. Notes:\n\n${task.notes}`;
    } else if (action === 'plan') {
      userPrompt = `Create a 7-day study plan tailored to the following notes and the task "${task.title}"; include daily goals and estimated study time. Return JSON: {"plan": [{"day":1,"goal":"...","minutes":60}, ...]}. Notes:\n\n${task.notes}`;
    }

    const aiText = await callOpenAI(system, userPrompt, 1200);
    // Try to extract JSON if structured
    let content = aiText;
    let stored = aiText;
    try {
      // extract JSON block if present
      const jsonStart = aiText.indexOf('{');
      if (jsonStart !== -1) {
        const jsonString = aiText.substring(jsonStart);
        JSON.parse(jsonString); // validate
        stored = jsonString;
      }
    } catch (e) {
      // keep raw text if parse fails
    }

    const out = await prisma.aIOutput.create({ data: { taskId: task.id, type: action, content: stored } });
    res.json({ output: out, raw: aiText });
  } catch (err) {
    console.error('generateOutput error', err.message || err);
    const payload = { error: 'AI generation failed' };
    if (process.env.NODE_ENV === 'development') payload.details = err.message;
    res.status(500).json(payload);
  }
}

module.exports = { createTask, listTasks, getTask, generateOutput, listOutputs, markComplete };
