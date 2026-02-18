const express = require('express');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const {
  createTask,
  listTasks,
  getTask,
  generateOutput,
  listOutputs,
  markComplete
} = require('../controllers/tasksController');

const router = express.Router();

router.use(auth);

router.post('/', validateBody({ title: { required: true, minLength: 1 }, notes: { required: true, minLength: 20 }, course: { required: false }, dueDate: { required: false, type: 'date' } }), createTask);
router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/:id/generate', validateBody({ action: { required: true } }), generateOutput);
router.get('/:id/outputs', listOutputs);
router.post('/:id/complete', markComplete);

module.exports = router;
