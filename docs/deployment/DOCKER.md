# Docker Deployment Guide

This guide explains how to deploy StockForumX using Docker and Docker Compose.

## Prerequisites

- Docker installed
- Docker Compose installed

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd StockForumX
   ```

2. **Configure environment variables**
   Copy the docker environment template:
   ```bash
   cp .env.docker .env
   ```
   Edit `.env` and set a secure `JWT_SECRET`.

3. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   Open your browser at `http://localhost`.

## Service Architecture

The setup consists of 4 containers:
- **nginx**: Reverse proxy listening on port 80. Routes `/api` to the backend and serves the frontend.
- **frontend**: React application served via internal Nginx.
- **backend**: Node.js/Express API.
- **price-updater**: Go microservice for high-frequency stock price updates.
- **mongodb**: Database with persistent volume `mongodb_data`.

## Useful Commands

### Check logs
```bash
docker-compose logs -f
```

### Stop all services
```bash
docker-compose down
```

### Restart a specific service
```bash
docker-compose restart backend
```

### Rebuild and restart
```bash
docker-compose up -d --build
```

### Run database seed (on a running container)
```bash
docker-compose exec backend npm run seed
```

## Production Considerations

- **SSL/TLS**: Update `nginx/nginx.conf` and `docker-compose.yml` to include your SSL certificates and listen on port 443.
- **Secrets**: Use Docker Secrets or a secure vault for sensitive environment variables.
- **Volumes**: Ensure the `mongodb_data` volume is backed up regularly.
