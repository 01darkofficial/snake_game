# Stage 1: Build the React Vite app
FROM node@sha256:41e4389f3d988d2ed55392df4db1420ad048ae53324a8e2b7c6d19508288107e AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY vite.config.ts ./

# Install dependencies (including dev dependencies)
RUN npm ci

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with a lightweight web server
FROM nginx:alpine 

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (default for HTTP)
EXPOSE 80