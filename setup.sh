#!/bin/bash

# 🚀 Transcendence Project Setup Script
# This script installs all necessary dependencies for development

set -e  # Exit on any error

echo "🏓 Setting up Transcendence development environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "docker-compose.dev.yml" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed${NC}"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}🚀 You can now start the development environment with:${NC}"
echo -e "${BLUE}make dev${NC}          # Interactive mode (logs in terminal)"
echo -e "${BLUE}make dev-detached${NC} # Background mode"
echo ""
echo -e "${YELLOW}📖 Other useful commands:${NC}"
echo -e "${BLUE}make status${NC}       # Check container status"
echo -e "${BLUE}make logs-dev${NC}     # View development logs"
echo -e "${BLUE}make stop-dev${NC}     # Stop development environment"
echo -e "${BLUE}make help${NC}         # Show all available commands"
echo ""
echo -e "${GREEN}🎮 Access your application at:${NC}"
echo -e "Frontend: ${BLUE}http://localhost:8080${NC}"
echo -e "Backend:  ${BLUE}http://localhost:3000${NC}"
