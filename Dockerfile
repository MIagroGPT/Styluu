# Stage 1: Build React/Vite App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Clean install for Linux container
RUN npm install

# Copy source code
COPY . .

# Ensure binary execution permissions
RUN chmod -R +x node_modules/.bin || true

# Build production bundle
RUN npx vite build

# Stage 2: Serve with ultralight high-performance Nginx
FROM nginx:alpine

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
