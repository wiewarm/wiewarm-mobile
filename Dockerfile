# Multi-stage build for Angular application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install all dependencies (including dev dependencies for Angular CLI)
RUN npm ci

# Copy source code
COPY app/ ./

# Build the application
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
