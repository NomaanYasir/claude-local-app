import React, { useEffect, useState } from 'react'
import { listTasks, createTask, listOutputs, markComplete, aiSummary, aiFlashcards, aiQuiz, aiStudyPlan, reportOutput, aiSummarizeNotes, aiQuizQuestions } from '../api'
import Toast from '../components/Toast'
import { useError } from '../context/ErrorContext'
import AIHelper from '../components/AIHelper'

function TaskItem({t, onOpen}){
  return <div className="task-item" onClick={()=>onOpen(t)}>
    <strong>{t.title}</strong>
    <div className="meta">{t.course} • {t.completed ? 'Done' : 'Pending'}</div>
  </div>
}

export default function Dashboard({ token, user, onLogout }){
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const [form, setForm] = useState({ title: '', course: '', dueDate: '', notes: '' });
  const [outputs, setOutputs] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const { setError } = useError();

  useEffect(()=>{ refresh() },[]);

  async function refresh(){
    setLoading(true);
    try{
      const t = await listTasks(token);
      setTasks(t);
    }catch(e){
      console.error(e);
      setError(e.error || (e.network ? e.error : 'Could not load tasks'));
    }
    setLoading(false);
  }

  function validate(values){
    const errs = {};
    if (!values.title || !values.title.trim()) errs.title = 'Title is required.';
    if (!values.notes || values.notes.trim().length < 20) errs.notes = 'Notes must be at least 20 characters.';
    if (values.dueDate) {
      const d = new Date(values.dueDate);
      if (Number.isNaN(d.getTime())) errs.dueDate = 'Due date is not a valid date.';
    }
    return errs;
  }

  async function submit(e){
    e.preventDefault();
    const vals = { ...form };
    const v = validate(vals);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try{
      await createTask(token, vals);
      setToast({ message: 'Task created', type: 'success' });
      setForm({ title: '', course: '', dueDate: '', notes: '' });
      await refresh();
    }catch(err){
      console.error(err);
      setError(err.error || (err.network ? err.error : 'Could not create task'));
      setToast({ message: err.error || 'Could not create task', type: 'error' });
    }finally{ setSubmitting(false); }
  }

  async function open(t){
    setOpenTask(t);
    try{
      const outs = await listOutputs(token,t.id);
      setOutputs(outs);
    }catch(e){
      console.error(e);
      setError(e.error || (e.network ? e.error : 'Could not load outputs'));
    }
  }

  const [generating, setGenerating] = useState(null); // action string or null

  async function doGen(action){
    if(!openTask) return;
    setGenerating(action);
    try{
      const notes = openTask.notes;
      let res;
      if (action === 'summary') res = await aiSummary(token, openTask.id, notes);
      else if (action === 'flashcards') res = await aiFlashcards(token, openTask.id, notes);
      else if (action === 'quiz') res = await aiQuiz(token, openTask.id, notes);
      else if (action === 'plan') res = await aiStudyPlan(token, openTask.id, notes);

      const outs = await listOutputs(token, openTask.id);
      setOutputs(outs);
      setToast({ message: `${action} generated`, type: 'success' });
    }catch(e){
      console.error(e);
      setError(e.error || (e.network ? e.error : 'Generation failed'));
      setToast({ message: e.error || 'Generation failed', type: 'error' });
    }finally{ setGenerating(null); }
  }

  async function complete(){
    if(!openTask) return;
    try{
      await markComplete(token, openTask.id);
      await refresh();
      setOpenTask(null);
      setToast({ message: 'Marked complete', type: 'success' });
    }catch(e){
      console.error(e);
      setError(e.error || (e.network ? e.error : 'Could not mark complete'));
      setToast({ message: e.error || 'Could not mark complete', type: 'error' });
    }
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand"> 
          <h2>Study AI</h2>
        </div>
        <nav className="nav">
          <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="nav-btn">Dashboard</button>
          <button onClick={()=>document.querySelector('.task-list')?.scrollIntoView({behavior:'smooth'})} className="nav-btn">Tasks</button>
        </nav>
        <div className="user-area">
          <span className="user-email">{user?.email}</span>
          <button onClick={onLogout} className="logout">Logout</button>
        </div>
      </header>

      <main>
        <section className="left">
          <AIHelper token={token} />
          <form onSubmit={submit} className="task-form" noValidate>
            <h3>Create Task</h3>
            <label>
              Title
              <input placeholder="Title" value={form.title} onChange={e=>{ setForm({...form,title:e.target.value}); setErrors({...errors,title:undefined}) }} />
              {errors.title && <div className="inline-error">{errors.title}</div>}
            </label>

            <label>
              Course
              <input placeholder="Course" value={form.course} onChange={e=>setForm({...form,course:e.target.value})} />
            </label>

            <label>
              Due date
              <input type="date" value={form.dueDate} onChange={e=>{ setForm({...form,dueDate:e.target.value}); setErrors({...errors,dueDate:undefined}) }} />
              {errors.dueDate && <div className="inline-error">{errors.dueDate}</div>}
            </label>

            <label>
              Notes
              <textarea placeholder="Notes" value={form.notes} onChange={e=>{ setForm({...form,notes:e.target.value}); setErrors({...errors,notes:undefined}) }} />
              {errors.notes && <div className="inline-error">{errors.notes}</div>}
            </label>

            <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Create'}</button>
          </form>

          <div className="task-list">
            <h3>Tasks</h3>
            {loading ? (
              <div>Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet. Create your first study task to get started.</p>
                <button onClick={() => document.querySelector('.task-form input')?.focus()}>Create task</button>
              </div>
            ) : (
              tasks.map(t=> <TaskItem key={t.id} t={t} onOpen={open} />)
            )}
          </div>
        </section>

        <section className="right">
          {openTask ? (
            <div className="task-detail">
              <h3>{openTask.title}</h3>
              <div className="meta">{openTask.course} • Due: {openTask.dueDate ? new Date(openTask.dueDate).toLocaleDateString() : '—'}</div>
              <pre className="notes">{openTask.notes}</pre>
              <div className="actions">
                          <button disabled={generating!=null || submitting} onClick={()=>doGen('summary')}>{generating==='summary' ? 'Generating...' : 'Generate Summary'}</button>
                          <button disabled={generating!=null || submitting} onClick={()=>doGen('flashcards')}>{generating==='flashcards' ? 'Generating...' : 'Generate Flashcards'}</button>
                          <button disabled={generating!=null || submitting} onClick={()=>doGen('quiz')}>{generating==='quiz' ? 'Generating...' : 'Generate Quiz'}</button>
                          <button disabled={generating!=null || submitting} onClick={()=>doGen('plan')}>{generating==='plan' ? 'Generating...' : 'Generate Study Plan'}</button>
                          <button onClick={complete} disabled={generating!=null || submitting}>Mark Complete</button>
              </div>

              <div className="outputs">
                <h4>Saved Outputs</h4>
                <div className="disclaimer">Note: AI-generated outputs are study aids and may be incomplete or contain errors. Do not submit them as final assignment answers.</div>
                {outputs.map(o => (
                  <div key={o.id} className="output">
                    <div className="output-head"><strong>{o.type}</strong>
                      <div className="output-actions">
                        <button disabled={generating!=null || submitting} onClick={() => {
                          const msg = window.prompt('Report inaccurate output (optional details):');
                          if (!msg) return;
                          (async ()=>{
                            try{
                              await reportOutput(token, o.id, msg);
                              setToast({ message: 'Thanks — feedback saved', type: 'success' });
                            }catch(err){
                              setToast({ message: err.error || 'Could not send feedback', type: 'error' });
                            }
                          })();
                        }}>Report</button>
                      </div>
                    </div>
                    <pre>{o.content}</pre>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="empty">Select a task to view details</div> }
        </section>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
