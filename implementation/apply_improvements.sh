#!/bin/bash
# Repository Cross-Link Improvement Implementation Script
# This script helps apply the identified improvements to repositories

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPOS_DIR="/workspace/repo-analysis"
IMPROVEMENTS_DIR="/workspace/implementation"

echo -e "${GREEN}Repository Cross-Link Improvement Implementation${NC}"
echo "================================================"

# Function to apply workflow testing
apply_workflow_testing() {
    local repo=$1
    echo -e "\n${YELLOW}Applying workflow testing to $repo...${NC}"
    
    # Create tests directory
    mkdir -p "$REPOS_DIR/$repo/tests"
    
    # Copy package.json template
    cat > "$REPOS_DIR/$repo/package.json" << 'EOF'
{
  "name": "REPO-workflow-tests",
  "version": "1.0.0",
  "description": "Validation tests for GitHub Actions workflows",
  "scripts": {
    "test": "node tests/run-all-tests.js",
    "test:validation": "node tests/workflow-validation.test.js",
    "test:integration": "node tests/integration-test.js",
    "test:simple": "node tests/simple-workflow-test.js",
    "test:verbose": "node tests/run-all-tests.js --verbose",
    "validate-workflows": "node tests/run-all-tests.js"
  },
  "dependencies": {
    "glob": "^11.0.3"
  },
  "license": "MIT"
}
EOF
    
    # Update repo name in package.json
    sed -i "s/REPO/$repo/g" "$REPOS_DIR/$repo/package.json"
    
    echo -e "${GREEN}✓ Workflow testing structure created for $repo${NC}"
}

# Function to apply documentation hub
apply_documentation_hub() {
    local repo=$1
    echo -e "\n${YELLOW}Creating documentation hub for $repo...${NC}"
    
    # Create documentation structure
    mkdir -p "$REPOS_DIR/$repo/docs"/{models,analysis,evidence,technical,legal}
    mkdir -p "$REPOS_DIR/$repo/docs/models"/{agent_based,discrete_event,system_dynamics,hypergnn}
    mkdir -p "$REPOS_DIR/$repo/docs/analysis"/{findings,reports,summaries}
    mkdir -p "$REPOS_DIR/$repo/docs/evidence"/{reports,verification}
    mkdir -p "$REPOS_DIR/$repo/docs/technical"/{architecture,api,guides}
    mkdir -p "$REPOS_DIR/$repo/docs/legal"/{frameworks,templates,procedures}
    
    # Create main docs README
    cat > "$REPOS_DIR/$repo/docs/README.md" << 'EOF'
# 📚 Documentation Hub

Welcome to the documentation hub. All documentation is organized by category for easy navigation.

## 📁 Documentation Categories

- 🧠 [Models Documentation](./models/)
- 📊 [Analysis Documentation](./analysis/)
- 📋 [Evidence Documentation](./evidence/)
- 🔧 [Technical Documentation](./technical/)
- ⚖️ [Legal Documentation](./legal/)

Last updated: $(date +%Y-%m-%d)
EOF
    
    echo -e "${GREEN}✓ Documentation hub created for $repo${NC}"
}

# Function to apply Docker support
apply_docker_support() {
    local repo=$1
    echo -e "\n${YELLOW}Adding Docker support to $repo...${NC}"
    
    # Create Dockerfile
    cat > "$REPOS_DIR/$repo/Dockerfile" << 'EOF'
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

CMD ["python", "main.py"]
EOF
    
    # Create docker-compose.yml
    cat > "$REPOS_DIR/$repo/docker-compose.yml" << 'EOF'
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./data:/app/data

volumes:
  data:
EOF
    
    # Create .dockerignore
    cat > "$REPOS_DIR/$repo/.dockerignore" << 'EOF'
__pycache__
*.pyc
.git
.env
venv/
env/
EOF
    
    echo -e "${GREEN}✓ Docker support added to $repo${NC}"
}

# Main menu
show_menu() {
    echo -e "\n${YELLOW}Select repository to improve:${NC}"
    echo "1) analysss"
    echo "2) analyticase"
    echo "3) avtomaatoctory"
    echo "4) ad-res-j7"
    echo "5) Apply to all repositories"
    echo "0) Exit"
    read -p "Enter choice: " repo_choice
    
    case $repo_choice in
        1) selected_repo="analysss" ;;
        2) selected_repo="analyticase" ;;
        3) selected_repo="avtomaatoctory" ;;
        4) selected_repo="ad-res-j7" ;;
        5) selected_repo="all" ;;
        0) exit 0 ;;
        *) echo -e "${RED}Invalid choice${NC}"; show_menu ;;
    esac
    
    echo -e "\n${YELLOW}Select improvement to apply:${NC}"
    echo "1) Workflow Testing (Phase 1)"
    echo "2) Documentation Hub (Phase 2)"
    echo "3) Docker Support (Phase 3)"
    echo "4) All improvements"
    echo "0) Back"
    read -p "Enter choice: " improvement_choice
    
    case $improvement_choice in
        1) improvement="workflow_testing" ;;
        2) improvement="documentation_hub" ;;
        3) improvement="docker_support" ;;
        4) improvement="all" ;;
        0) show_menu ;;
        *) echo -e "${RED}Invalid choice${NC}"; show_menu ;;
    esac
    
    # Apply improvements
    if [ "$selected_repo" = "all" ]; then
        repos=("analysss" "analyticase" "avtomaatoctory" "ad-res-j7")
    else
        repos=("$selected_repo")
    fi
    
    for repo in "${repos[@]}"; do
        if [ ! -d "$REPOS_DIR/$repo" ]; then
            echo -e "${RED}Repository $repo not found in $REPOS_DIR${NC}"
            continue
        fi
        
        if [ "$improvement" = "all" ] || [ "$improvement" = "workflow_testing" ]; then
            apply_workflow_testing "$repo"
        fi
        
        if [ "$improvement" = "all" ] || [ "$improvement" = "documentation_hub" ]; then
            apply_documentation_hub "$repo"
        fi
        
        if [ "$improvement" = "all" ] || [ "$improvement" = "docker_support" ]; then
            apply_docker_support "$repo"
        fi
    done
    
    echo -e "\n${GREEN}Improvements applied successfully!${NC}"
    show_menu
}

# Check if repos directory exists
if [ ! -d "$REPOS_DIR" ]; then
    echo -e "${RED}Error: Repository directory $REPOS_DIR not found${NC}"
    exit 1
fi

# Start the menu
show_menu