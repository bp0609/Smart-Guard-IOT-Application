# Define variables (update these with your actual values)
BACKEND_DIR=backend
FRONTEND_DIR=frontend
DB_USER=postgres
DB_NAME=smart_guard
DB_PASSWORD=bp0609
DB_HOST=localhost
DB_PORT=5432

# .PHONY specifies targets that aren't actual files
.PHONY: start-backend start-frontend create-db drop-db migrate rollback build-backend build-frontend dev start seed

help:
	@echo "Available commands:"
	@echo "  make start-backend   - Start the backend server in development mode"
	@echo "  make start-frontend  - Start the frontend client (Vite dev server)"
	@echo "  make create-db       - Create the PostgreSQL database"
	@echo "  make drop-db         - Drop the PostgreSQL database if it exists"
	@echo "  make migrate-up      - Apply database schema migrations (up.sql)"
	@echo "  make migrate-down    - Rollback database schema migrations (down.sql)"
	@echo "  make seed-db            - Seed the database with initial data"
	@echo "  make dev             - Run both backend and frontend in development mode"
	@echo "  make build-backend   - Build the backend (TypeScript to JavaScript)"
	@echo "  make build-frontend  - Build the frontend (Vite build)"
	@echo "  make start           - Start both backend and frontend concurrently"
	@echo "  make reset-db        - Reset the database (migrate-down --> migrate-up --> seed-db)"

# Start the backend in development mode
start-backend:
	@echo "Starting backend server..."
	cd $(BACKEND_DIR) && npm run dev

# Start the frontend (Vite dev server for React + TypeScript)
start-frontend:
	@echo "Starting frontend client..."
	cd $(FRONTEND_DIR) && npm run dev

# Create the PostgreSQL database
create-db:
	@echo "Creating database $(DB_NAME)..."
	@PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -c "CREATE DATABASE $(DB_NAME);" || true
# Drop the PostgreSQL database
drop-db:
	@echo "Dropping database $(DB_NAME)..."
	@PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -c "DROP DATABASE IF EXISTS $(DB_NAME);" || true

# Run database schema up migrations
migrate-up:
	@echo "Running database up migrations..."
	@PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -f db/migration/up.sql

# Run database schema down migrations
migrate-down:
	@echo "Running database down migrations..."
	@PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -f db/migration/down.sql

# Seed the database with initial data
seed-db:
	@echo "Seeding database..."
	@PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT) -d $(DB_NAME) -f db/seed.sql

# Clean the database (drop, create, migrate, seed)
reset-db: migrate-down migrate-up seed-db

# Run both backend and frontend in development mode
dev:
	@echo "Starting development environment..."
	@make start-backend & make start-frontend

# Build the backend (transpile TypeScript to JavaScript)
build-backend:
	@echo "Building backend..."
	cd $(BACKEND_DIR) && npm run build

# Build the frontend (Vite build for React)
build-frontend:
	@echo "Building frontend..."
	cd $(FRONTEND_DIR) && npm run build

# Combined target: run both servers concurrently (requires 'concurrently' package)
start:
	@echo "Starting both backend and frontend..."
	npx concurrently "make start-backend" "make start-frontend"
