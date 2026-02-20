FROM node:18-slim
WORKDIR /app
ENV DATABASE_URL="file:/tmp/dev.db"
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
