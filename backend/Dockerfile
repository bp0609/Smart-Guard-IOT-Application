# ---- Stage 1: Build ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copy dependency files
    COPY package*.json tsconfig.json ./
    
    # Install all dependencies (including devDeps for TS build)
    RUN npm install
    
    # Copy source and build
    COPY src ./src
    RUN npm run build
    
# ---- Stage 2: Production ----
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Copy only the necessary files from builder
    COPY --from=builder /app/package*.json ./
    RUN npm install --omit=dev
    
    # Copy built code
    COPY --from=builder /app/dist ./dist
    
    # Expose port (match your backend port)
    EXPOSE 5000
    
    # Set environment variable for production
    ENV NODE_ENV=production
    
    # Run the server
    CMD ["node", "dist/index.js"]
    