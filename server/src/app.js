const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const outputsRoutes = require('./routes/outputs');

const app = express();

// security headers
app.use(helmet());

// CORS: allow specific origins via env `CORS_ORIGIN` (comma-separated). In development, allow all.
const corsOptions = {};
if (process.env.CORS_ORIGIN) {
  corsOptions.origin = process.env.CORS_ORIGIN.split(',');
} else if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = false; // deny by default in production unless configured
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Rate limiters
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 12, standardHeaders: true, legacyHeaders: false });

app.use('/auth', authLimiter, authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/outputs', outputsRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'Study AI server' }));

// Health endpoint for App Runner / load balancers
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// basic error handler
// Centralized error handler — never leak stack traces in production. Include details only in development.
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  const payload = { error: status >= 500 ? 'Internal server error' : (err && err.message ? err.message : 'Error') };
  if (process.env.NODE_ENV === 'development') {
    payload.details = err && err.message ? err.message : String(err);
  }
  res.status(status).json(payload);
});

module.exports = app;
