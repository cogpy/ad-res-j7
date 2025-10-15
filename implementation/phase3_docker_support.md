# Phase 3: Docker Support Implementation Guide

## Overview
This guide implements production-ready Docker deployment from `analyticase` into the other repositories.

## Core Docker Files

### Dockerfile

```dockerfile
# Multi-stage build for efficiency
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 appuser

# Set working directory
WORKDIR /app

# Copy from builder
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . .

# Set PATH
ENV PATH=/home/appuser/.local/bin:$PATH

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command
CMD ["python", "main.py"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: ${COMPOSE_PROJECT_NAME:-legal-analysis}-app
    ports:
      - "${PORT:-8000}:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL:-redis://redis:6379}
      - LOG_LEVEL=${LOG_LEVEL:-INFO}
      - ENVIRONMENT=${ENVIRONMENT:-production}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    container_name: ${COMPOSE_PROJECT_NAME:-legal-analysis}-db
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-legal_analysis}
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT:-5432}:5432"
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: ${COMPOSE_PROJECT_NAME:-legal-analysis}-redis
    volumes:
      - redis-data:/data
    ports:
      - "${REDIS_PORT:-6379}:6379"
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: ${COMPOSE_PROJECT_NAME:-legal-analysis}-nginx
    ports:
      - "${NGINX_PORT:-80}:80"
      - "${NGINX_SSL_PORT:-443}:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### .dockerignore

```
# Git
.git
.gitignore

# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.pytest_cache/

# Virtual environments
venv/
env/
ENV/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Project specific
/data/*
/logs/*
/temp/*
*.sqlite3
.env
.env.*
!.env.example

# Documentation
/docs/
*.md
!README.md

# Tests
/tests/
/test/
```

### Environment Configuration

#### .env.example

```bash
# Application
ENVIRONMENT=production
PORT=8000
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://postgres:password@db:5432/legal_analysis
POSTGRES_DB=legal_analysis
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Redis
REDIS_URL=redis://redis:6379
REDIS_PORT=6379

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# External APIs (if applicable)
OPENAI_API_KEY=your-api-key
GITHUB_TOKEN=your-github-token

# Docker Compose
COMPOSE_PROJECT_NAME=legal-analysis
```

### Nginx Configuration

#### nginx/nginx.conf

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;

    upstream app {
        server app:8000;
    }

    server {
        listen 80;
        server_name localhost;

        # Redirect to HTTPS in production
        # return 301 https://$server_name$request_uri;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /static/ {
            alias /app/static/;
            expires 30d;
        }

        location /media/ {
            alias /app/media/;
            expires 30d;
        }
    }
}
```

## Repository-Specific Configurations

### For ad-res-j7

Add specialized configuration for evidence handling:

```yaml
# Additional service in docker-compose.yml
  evidence-processor:
    build:
      context: .
      dockerfile: Dockerfile.evidence
    environment:
      - EVIDENCE_PATH=/app/evidence
      - OCR_ENABLED=true
    volumes:
      - ./evidence:/app/evidence
      - ./processed:/app/processed
    depends_on:
      - app
```

### For analysss

Add simulation runner service:

```yaml
# Additional service in docker-compose.yml
  simulation-runner:
    build:
      context: .
      dockerfile: Dockerfile.simulation
    environment:
      - SIMULATION_OUTPUT=/app/simulations/results
      - MAX_WORKERS=4
    volumes:
      - ./simulations:/app/simulations
    depends_on:
      - app
      - redis
```

### For avtomaatoctory

Similar to analysss but simplified.

## Deployment Scripts

### scripts/docker-deploy.sh

```bash
#!/bin/bash
set -e

# Load environment
source .env

# Build and deploy
echo "🚀 Building Docker images..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

echo "🏥 Running health checks..."
docker-compose ps

echo "✅ Deployment complete!"
echo "Access the application at http://localhost:${PORT:-8000}"
```

### scripts/docker-backup.sh

```bash
#!/bin/bash
set -e

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up database..."
docker-compose exec -T db pg_dump -U postgres legal_analysis > "$BACKUP_DIR/database.sql"

echo "📁 Backing up volumes..."
docker run --rm -v legal-analysis_postgres-data:/data -v "$PWD/$BACKUP_DIR":/backup \
    alpine tar czf /backup/postgres-data.tar.gz -C /data .

echo "✅ Backup complete: $BACKUP_DIR"
```

## GitHub Actions for Docker

### .github/workflows/docker-build.yml

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      if: github.event_name != 'pull_request'
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: ${{ github.event_name != 'pull_request' }}
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

## Benefits

1. **Consistent Environment**: Same behavior across all deployments
2. **Easy Scaling**: Horizontal scaling with docker-compose
3. **Isolation**: Services run in isolated containers
4. **Portability**: Deploy anywhere Docker runs
5. **Development Parity**: Dev environment matches production

## Security Considerations

1. **Non-root User**: Containers run as non-root
2. **Secret Management**: Use Docker secrets in production
3. **Network Isolation**: Services communicate on internal network
4. **Volume Permissions**: Proper file permissions
5. **Image Scanning**: Regular vulnerability scanning

## Monitoring and Logging

1. **Health Checks**: Built-in health monitoring
2. **Log Aggregation**: Centralized logging
3. **Metrics Collection**: Performance monitoring
4. **Alerting**: Automated alerts for issues
5. **Backup Strategy**: Regular automated backups