const express = require('express');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { summary, flashcards, quiz, studyPlan, summarizeNotes, quizQuestions } = require('../controllers/aiController');

const router = express.Router();

router.use(auth);

router.post('/summary', validateBody({ taskId: { required: true, type: 'number' }, notes: { required: true, minLength: 10 } }), summary);
router.post('/summarize', validateBody({ taskId: { required: true, type: 'number' }, notes: { required: true, minLength: 10 } }), summary); // alias for compatibility
router.post('/flashcards', validateBody({ taskId: { required: true, type: 'number' }, notes: { required: true, minLength: 10 } }), flashcards);
router.post('/quiz', validateBody({ taskId: { required: true, type: 'number' }, notes: { required: true, minLength: 10 } }), quiz);
router.post('/study-plan', validateBody({ taskId: { required: true, type: 'number' }, notes: { required: true, minLength: 10 } }), studyPlan);
// Ad-hoc notes endpoints for AI Study Helper
router.post('/summarize-notes', validateBody({ notes: { required: true, minLength: 30, maxLength: 3000 } }), summarizeNotes);
router.post('/quiz-questions', validateBody({ notes: { required: true, minLength: 50, maxLength: 5000 } }), quizQuestions);

module.exports = router;
