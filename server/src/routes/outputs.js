const express = require('express');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { report } = require('../controllers/feedbackController');

const router = express.Router();

router.use(auth);

// POST /outputs/:id/report
router.post('/:id/report', validateBody({ message: { required: true, minLength: 1 } }), report);

module.exports = router;
