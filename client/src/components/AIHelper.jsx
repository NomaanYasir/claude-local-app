import React, { useState } from 'react'
import { aiSummarizeNotes, aiQuizQuestions } from '../api'
import Toast from './Toast'

export default function AIHelper({ token }){
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [questions, setQuestions] = useState([])

  const MIN = 30;
  const MAX = 3000;

  async function doSummarize(){
    setError(null)
    setSummary(null)
    if (!notes || notes.trim().length < MIN) return setError(`Notes must be at least ${MIN} characters.`)
    if (notes.length > MAX) return setError(`Notes must be under ${MAX} characters.`)
    setLoading('summarize')
    try{
      const res = await aiSummarizeNotes(token, notes)
      setSummary(res.summary || res.raw || 'No summary returned')
    }catch(e){
      setError(e.error || (e.network ? e.error : 'AI error'))
    }finally{ setLoading(false) }
  }

  async function doQuiz(){
    setError(null)
    setQuestions([])
    if (!notes || notes.trim().length < 50) return setError('Notes must be at least 50 characters for quiz generation.')
    setLoading('quiz')
    try{
      const res = await aiQuizQuestions(token, notes)
      if (res.questions) setQuestions(res.questions)
      else setError('Could not parse questions from AI response.')
    }catch(e){
      setError(e.error || (e.network ? e.error : 'AI error'))
    }finally{ setLoading(false) }
  }

  return (
    <div className="ai-helper">
      <h3>AI Study Helper</h3>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Paste notes here..." rows={8} />
      <div className="ai-actions">
        <button onClick={doSummarize} disabled={!!loading}>{loading==='summarize' ? 'Summarizing...' : 'Summarize Notes'}</button>
        <button onClick={doQuiz} disabled={!!loading}>{loading==='quiz' ? 'Generating...' : 'Generate 5 Quiz Questions'}</button>
      </div>
      {error && <div className="inline-error">{error}</div>}

      {summary && (
        <div className="ai-result ai-summary">
          <h4>Summary</h4>
          <p>{summary}</p>
        </div>
      )}

      {questions && questions.length>0 && (
        <div className="ai-result ai-quiz">
          <h4>Quiz Questions</h4>
          <ol>
            {questions.map((q,i)=> (
              <li key={i}>
                <div className="q">{q.q}</div>
                <ul className="choices">{(q.choices||[]).map((c,ci)=>(<li key={ci}>{c}</li>))}</ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
