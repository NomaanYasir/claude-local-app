const fetch = require('node-fetch');

const API = process.env.API_URL || 'https://crp7vvzfmh.us-east-1.awsapprunner.com';

function ok(cond, msg){ if (!cond) { console.error('FAIL:', msg); process.exit(2); } }

async function run(){
  console.log('Regression test starting against', API);
  // 1. Register
  const email = `regress+${Date.now()}@example.com`;
  let res = await fetch(API + '/auth/register', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email, password: 'Regress123', name: 'Regress' }) });
  let json = await res.json().catch(()=>null);
  ok(res.ok, 'register should succeed: ' + JSON.stringify(json));
  const token = json.token;

  // 2. Create a task
  res = await fetch(API + '/tasks', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: 'Regression Task', notes: 'This is a regression test note with enough length to pass validation.' }) });
  json = await res.json().catch(()=>null);
  ok(res.ok && json.id, 'create task should succeed: ' + JSON.stringify(json));
  const taskId = json.id;

  // 3. Call AI helper summarize-notes (ad-hoc)
  res = await fetch(API + '/api/ai/summarize-notes', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ notes: 'Short but valid notes for regression summary that exceed minimum length.' }) });
  json = await res.json().catch(()=>null);
  ok(res.ok && (json.summary || json.raw), 'ai summarize-notes should return summary');

  // 4. Create AI output via tasks generate (summary)
  res = await fetch(API + `/tasks/${taskId}/generate`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ action: 'summary' }) });
  json = await res.json().catch(()=>null);
  ok(res.ok && json.output, 'tasks generate should return output');

  console.log('Regression tests passed');
}

run().catch(err=>{ console.error('Regression run error', err); process.exit(3); });
