# Pneuma Development Commands

# Kill stale processes on a port (usage: make kill PORT=3001)
kill:
	@lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || true

# Start backend server (auto-kills stale process on 3001 first)
server s:
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@sleep 0.3
	cd server && node index.js

# Start frontend dev server (auto-kills stale process on 5173 first)
client c:
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@sleep 0.3
	cd client && npm run dev

# Kill all dev ports
killall:
	@lsof -ti:3001,5173 | xargs kill -9 2>/dev/null || true
	@echo "Ports 3001 and 5173 cleared."

# Install all dependencies
install:
	cd server && npm install
	cd client && npm install

# Start both (run in separate terminals or use 'make dev')
dev:
	@echo "Starting backend and frontend..."
	@make server & make client

.PHONY: server client install dev s c kill killall
