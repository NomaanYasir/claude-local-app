require('dotenv').config();
const app = require('./app');

const { execSync } = require('child_process');

const PORT = process.env.PORT || 4000;
// In production, ensure critical secrets are configured
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not set in production environment. Exiting.');
    process.exit(1);
  }
}

// Run Prisma codegen + migrations on startup so the container is self-initializing.
// App Runner provides an ephemeral filesystem; migrations run on the local SQLite file
// referenced by DATABASE_URL. For production use a managed DB (RDS) instead.
try {
  console.log('Running: npx prisma generate');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (err) {
  console.warn('prisma generate failed (continuing):', err.message || err);
}

try {
  console.log('Running: npx prisma migrate deploy');
  // Use migrate deploy (safe for CI/production) rather than migrate dev
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (err) {
  console.warn('prisma migrate deploy failed (continuing):', err.message || err);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
