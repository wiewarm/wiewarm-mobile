# Multi-stage build for Angular application
FROM --platform=$BUILDPLATFORM node:22-bookworm-slim AS builder

# Set working directory
WORKDIR /app

# Chrome for Karma headless tests in CI/container
RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium \
  && rm -rf /var/lib/apt/lists/*
ENV CHROME_BIN=/usr/bin/chromium

# Copy package files
COPY app/package*.json ./

# Install all dependencies (including dev dependencies for Angular CLI)
RUN npm ci --no-audit --no-fund

# Copy source code
COPY app/ ./

# Enforce lint, test and build (fail fast with clear step output)
RUN npm run lint
RUN npm run test -- --watch=false --browsers=ChromeHeadless --no-progress
RUN npm run build

# Production stage with Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install serve package for production serving
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist/app ./dist

# Expose port 3000 (serve default)
EXPOSE 3000

# Start the application with serve
CMD ["serve", "-s", "dist", "-l", "3000"]
