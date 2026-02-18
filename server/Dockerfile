FROM node:18-alpine

WORKDIR /app

# Install dependencies (install dev dependencies so prisma CLI is available at runtime)
COPY package*.json ./
RUN npm ci

# Copy application files
COPY prisma ./prisma
COPY . .

# Generate Prisma client at build time (also ran on startup)
RUN npx prisma generate || true

EXPOSE 4000

# Start the server; the server will run `prisma migrate deploy` on startup.
CMD ["node", "src/index.js"]
