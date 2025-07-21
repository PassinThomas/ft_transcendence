# 🏓 Transcendence

A modern Pong game with multiplayer capabilities, built with TypeScript, Node.js, and containerized with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Make (for easy command management)

### Development
```bash
make dev              # Start development environment
```
Access:
- **Frontend**: http://localhost:8080 (with hot reload)
- **Backend API**: http://localhost:3000 (direct access)

### Production
```bash
make prod             # Start production environment
```
Access:
- **Application**: http://localhost:80 (Nginx proxy)

## 📋 Docker Management Commands

### 🛠️ Development Environment
| Command | Description |
|---------|-------------|
| `make dev` | Start development environment (interactive) |
| `make dev-detached` | Start development in background |
| `make build-dev` | Build development services only |
| `make stop-dev` | Stop development environment |
| `make re-dev` | Restart development environment |
| `make logs-dev` | Show development logs (follow mode) |

### 🏭 Production Environment
| Command | Description |
|---------|-------------|
| `make prod` | Start production environment (interactive) |
| `make prod-detached` | Start production in background |
| `make build-prod` | Build production services only |
| `make stop-prod` | Stop production environment |
| `make re-prod` | Restart production environment |
| `make logs-prod` | Show production logs (follow mode) |

### 🧹 Utility Commands
| Command | Description |
|---------|-------------|
| `make status` | Show running containers status |
| `make clean` | Clean containers, networks, and volumes |
| `make fclean` | Deep clean (including Docker images) |
| `make help` | Show all available commands |

## 🏗️ Architecture

### Development Setup
- **Frontend**: Vite dev server with hot reload (port 8080)
- **Backend**: Node.js with live reload (port 3000)
- **Database**: SQLite container
- **Volumes**: Source code mounted for live development

### Production Setup
- **Nginx**: Reverse proxy and static file server (port 80)
- **Backend**: Node.js production build (internal port 3000)
- **Database**: SQLite container
- **Network**: Internal Docker network for service communication

## 📁 Project Structure
```
transcendence/
├── frontend/           # TypeScript/Vite frontend
├── backend/            # Node.js/TypeScript API
├── nginx/              # Nginx configuration
├── docker-compose.dev.yml   # Development environment
├── docker-compose.prod.yml  # Production environment
└── Makefile           # Command shortcuts
```

## 🔧 Development Workflow

1. **Start development environment**:
   ```bash
   make dev
   ```

2. **Check container status**:
   ```bash
   make status
   ```

3. **View logs** (in another terminal):
   ```bash
   make logs-dev
   ```

4. **Stop when done**:
   ```bash
   make stop-dev
   ```

## 🚀 Production Deployment

1. **Build and start production**:
   ```bash
   make prod-detached
   ```

2. **Monitor production logs**:
   ```bash
   make logs-prod
   ```

3. **Check health**:
   ```bash
   make status
   ```

## 🧹 Cleanup & Maintenance

- **Regular cleanup** (containers & networks):
  ```bash
  make clean
  ```

- **Deep cleanup** (includes images & system cleanup):
  ```bash
  make fclean
  ```

## 🐛 Troubleshooting

### Port Already in Use
```bash
make clean    # Clean up existing containers
make dev      # Try again
```

### Build Issues
```bash
make fclean   # Deep clean everything
make build-dev # Rebuild from scratch
```

### View Container Logs
```bash
make logs-dev   # Development logs
make logs-prod  # Production logs
```

## 📚 Additional Resources

- Run `make help` for a quick command reference
- Check `docker-compose.dev.yml` for development configuration
- Check `docker-compose.prod.yml` for production configuration