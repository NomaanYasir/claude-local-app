const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(systemPrompt, userPrompt, maxTokens = 800) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    max_tokens: maxTokens
  };

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }

  const json = await res.json();
  const message = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
  return message;
}

module.exports = { callOpenAI };
