# Build Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html .
COPY frontend/vite.config.ts .
COPY frontend/tsconfig.json .
COPY frontend/tsconfig.app.json .
COPY frontend/tsconfig.node.json .
COPY frontend/postcss.config.js .
COPY frontend/tailwind.config.ts .

# Build-time frontend environment variables
ARG VITE_AUTH_SERVICE_URL
ARG VITE_BOOKING_SERVICE_URL
ARG VITE_PAYMENT_SERVICE_URL
ENV VITE_AUTH_SERVICE_URL=${VITE_AUTH_SERVICE_URL}
ENV VITE_BOOKING_SERVICE_URL=${VITE_BOOKING_SERVICE_URL}
ENV VITE_PAYMENT_SERVICE_URL=${VITE_PAYMENT_SERVICE_URL}

# Build application
RUN npm run build

# Serve with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
