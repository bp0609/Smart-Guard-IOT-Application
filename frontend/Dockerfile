# ---- Stage 1: Build with Node ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    COPY package*.json tsconfig*.json vite.config.ts ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    # ---- Stage 2: Serve with Nginx ----
    FROM nginx:alpine
    
    # Remove default nginx static files
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy built static files from builder
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Expose port 80
    EXPOSE 80
    
    # Run nginx
    CMD ["nginx", "-g", "daemon off;"]
    