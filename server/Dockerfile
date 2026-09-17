# ─── Build Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ─── Runtime Stage ──────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Non-root user for security
RUN addgroup -S styluu && adduser -S styluu -G styluu
USER styluu

EXPOSE 3001

CMD ["node", "index.js"]
