const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
import { inc as loadingInc, dec as loadingDec } from './lib/loading';

async function request(path, token, opts = {}){
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  let res;
  loadingInc();
  try{
    res = await fetch(API_URL + path, { ...opts, headers });
  }catch(e){
    // network failure
    throw { network: true, error: 'Network error — please check your connection' };
  }finally{
    loadingDec();
  }

  const json = await res.json().catch(()=>null);
  if (!res.ok) {
    const err = json || { error: res.statusText || 'Request failed' };
    err.status = res.status;
    throw err;
  }
  return json;
}

export async function register(data){
  return request('/auth/register', null, { method: 'POST', body: JSON.stringify(data) });
}
export async function login(data){
  return request('/auth/login', null, { method: 'POST', body: JSON.stringify(data) });
}

export async function createTask(token, data){ return request('/tasks', token, { method: 'POST', body: JSON.stringify(data) }); }
export async function listTasks(token){ return request('/tasks', token); }
export async function getTask(token,id){ return request(`/tasks/${id}`, token); }
export async function generate(token,id,action){ return request(`/tasks/${id}/generate`, token, { method: 'POST', body: JSON.stringify({ action }) }); }
export async function listOutputs(token,id){ return request(`/tasks/${id}/outputs`, token); }
export async function markComplete(token,id){ return request(`/tasks/${id}/complete`, token, { method: 'POST' }); }

// New AI endpoints
export async function aiSummary(token, taskId, notes){ return request('/api/ai/summary', token, { method: 'POST', body: JSON.stringify({ taskId, notes }) }); }
export async function aiFlashcards(token, taskId, notes){ return request('/api/ai/flashcards', token, { method: 'POST', body: JSON.stringify({ taskId, notes }) }); }
export async function aiQuiz(token, taskId, notes){ return request('/api/ai/quiz', token, { method: 'POST', body: JSON.stringify({ taskId, notes }) }); }
export async function aiStudyPlan(token, taskId, notes){ return request('/api/ai/study-plan', token, { method: 'POST', body: JSON.stringify({ taskId, notes }) }); }
export async function reportOutput(token, outputId, message){ return request(`/outputs/${outputId}/report`, token, { method: 'POST', body: JSON.stringify({ message }) }); }
// AI Study Helper endpoints (ad-hoc notes)
export async function aiSummarizeNotes(token, notes){ return request('/api/ai/summarize-notes', token, { method: 'POST', body: JSON.stringify({ notes }) }); }
export async function aiQuizQuestions(token, notes){ return request('/api/ai/quiz-questions', token, { method: 'POST', body: JSON.stringify({ notes }) }); }
