#!/bin/bash

# setup.sh - Project Initialization Script
# This script sets up the project by installing dependencies and configuring environment variables.

# Set colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting project setup...${NC}"

# 1. Check for Bun
if ! command -v bun &> /dev/null
then
    echo -e "${RED}❌ Bun is not installed.${NC}"
    echo -e "${YELLOW}Please install Bun first: https://bun.sh/${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Bun is installed: $(bun --version)${NC}"
fi

# 2. Install Dependencies
echo -e "${BLUE}📦 Installing dependencies with Bun...${NC}"
bun install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully.${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies.${NC}"
    exit 1
fi

# 3. Setup Environment Variables
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${BLUE}📝 Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created.${NC}"
        echo -e "${YELLOW}⚠️  Please remember to update .env with your own secrets!${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env.example found. Skipping .env creation.${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file already exists.${NC}"
fi

echo -e "\n${GREEN}✨ Setup complete!${NC}"
echo -e "You can now start the development server by running:"
echo -e "${BLUE}   bun run dev${NC}\n"
