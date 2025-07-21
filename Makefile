# **************************************************************************** #
#                                  VARIABLES                                   #
# **************************************************************************** #

END				=	\033[0m

# COLORS

GREY			=	\033[0;30m
RED				=	\033[0;31m
GREEN			=	\033[0;32m
YELLOW			=	\033[0;33m
BLUE			=	\033[0;34m
PURPLE			=	\033[0;35m
CYAN			=	\033[0;36m
WHITE			=	\033[0;37m

# **************************************************************************** #
#                                    RULES                                     #
# **************************************************************************** #

# Default target
all: help

# Development environment
dev:
	@echo "${BLUE}> Starting development environment...${END}"
	@docker-compose -f docker-compose.dev.yml up --build
	@echo "${GREEN}> Development environment started! 🚀${END}"

dev-detached:
	@echo "${BLUE}> Starting development environment in detached mode...${END}"
	@docker-compose -f docker-compose.dev.yml up --build -d
	@echo "${GREEN}> Development environment started in background! 🚀${END}"

# Production environment
prod:
	@echo "${BLUE}> Starting production environment...${END}"
	@docker-compose -f docker-compose.prod.yml up --build
	@echo "${GREEN}> Production environment started! 🚀${END}"

prod-detached:
	@echo "${BLUE}> Starting production environment in detached mode...${END}"
	@docker-compose -f docker-compose.prod.yml up --build -d
	@echo "${GREEN}> Production environment started in background! 🚀${END}"

# Build services without starting
build-dev:
	@echo "${CYAN}> Building development services...${END}"
	@docker-compose -f docker-compose.dev.yml build
	@echo "${GREEN}> Development services built! ✅${END}"

build-prod:
	@echo "${CYAN}> Building production services...${END}"
	@docker-compose -f docker-compose.prod.yml build
	@echo "${GREEN}> Production services built! ✅${END}"

# Stop services
stop-dev:
	@echo "${YELLOW}> Stopping development environment...${END}"
	@docker-compose -f docker-compose.dev.yml down
	@echo "${GREEN}> Development environment stopped! 🛑${END}"

stop-prod:
	@echo "${YELLOW}> Stopping production environment...${END}"
	@docker-compose -f docker-compose.prod.yml down
	@echo "${GREEN}> Production environment stopped! 🛑${END}"

# Clean up containers, networks, and volumes
clean:
	@echo "${YELLOW}> Cleaning up Docker containers and networks...${END}"
	@docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans 2>/dev/null || true
	@docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans 2>/dev/null || true
	@echo "${GREEN}> Cleanup completed! 🧹${END}"

# Complete cleanup including images
fclean: clean
	@echo "${RED}> Deep cleaning Docker images and volumes...${END}"
	@docker system prune -af --volumes 2>/dev/null || true
	@echo "${GREEN}> Deep cleanup completed! 💥${END}"

# Restart environments
re-dev: stop-dev dev

re-prod: stop-prod prod

# Show logs
logs-dev:
	@docker-compose -f docker-compose.dev.yml logs -f

logs-prod:
	@docker-compose -f docker-compose.prod.yml logs -f

# Show running containers
status:
	@echo "${CYAN}> Current Docker containers status:${END}"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Help
help:
	@echo "${PURPLE}🚀 Transcendence Project - Docker Management${END}\n"
	@echo "${CYAN}Development Commands:${END}"
	@echo "  ${GREEN}make dev${END}           - Start development environment"
	@echo "  ${GREEN}make dev-detached${END}  - Start development environment in background"
	@echo "  ${GREEN}make build-dev${END}     - Build development services only"
	@echo "  ${GREEN}make stop-dev${END}      - Stop development environment"
	@echo "  ${GREEN}make re-dev${END}        - Restart development environment"
	@echo "  ${GREEN}make logs-dev${END}      - Show development logs"
	@echo ""
	@echo "${CYAN}Production Commands:${END}"
	@echo "  ${GREEN}make prod${END}          - Start production environment"
	@echo "  ${GREEN}make prod-detached${END} - Start production environment in background"
	@echo "  ${GREEN}make build-prod${END}    - Build production services only"
	@echo "  ${GREEN}make stop-prod${END}     - Stop production environment"
	@echo "  ${GREEN}make re-prod${END}       - Restart production environment"
	@echo "  ${GREEN}make logs-prod${END}     - Show production logs"
	@echo ""
	@echo "${CYAN}Utility Commands:${END}"
	@echo "  ${GREEN}make status${END}        - Show running containers"
	@echo "  ${GREEN}make clean${END}         - Clean containers and networks"
	@echo "  ${GREEN}make fclean${END}        - Deep clean (including images)"
	@echo "  ${GREEN}make help${END}          - Show this help message"

.PHONY: all dev dev-detached prod prod-detached build-dev build-prod stop-dev stop-prod clean fclean re-dev re-prod logs-dev logs-prod status help
