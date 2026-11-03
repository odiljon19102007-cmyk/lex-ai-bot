FROM node:20-alpine

WORKDIR /app

# Install dependencies for native modules and curl
RUN apk add --no-cache curl bash

# Copy package files
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build frontend production bundle
RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Run with tsx server.ts
CMD ["npx", "tsx", "server.ts"]
