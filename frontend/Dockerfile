# Multi-stage Dockerfile for EcoLoop React + Vite Frontend
# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies with lockfile caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Lightweight Production Nginx
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Clean default Nginx assets
RUN rm -rf ./*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx SPA and reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
