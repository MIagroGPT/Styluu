# Stage 1: Build React/Vite App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Clean install for Linux container
RUN npm install

# Copy source code
COPY . .

# Accept API URL as build argument so Vite bakes it into the bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Ensure binary execution permissions
RUN chmod -R +x node_modules/.bin || true

# Build production bundle (VITE_API_URL will be embedded here)
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
