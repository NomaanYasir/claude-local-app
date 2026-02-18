const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.post('/register', validateBody({ email: { required: true, type: 'email' }, password: { required: true, minLength: 6 }, name: { required: false } }), register);
router.post('/login', validateBody({ email: { required: true, type: 'email' }, password: { required: true } }), login);

module.exports = router;
