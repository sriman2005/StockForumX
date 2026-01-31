# Docker Deployment Guide

[← Back to Documentation Index](../README.md)

This guide explains how to deploy StockForumX using Docker and Docker Compose.

## Prerequisites

- **Docker** installed
- **Docker Compose** installed

## Quick Start

1.  **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd StockForumX
    ```

2.  **Configure environment variables**

    Copy the template and edit it:

    ```bash
    cp .env.docker .env
    ```

    > [!WARNING]
    > Change the `JWT_SECRET` in `.env` to a secure random string before deploying.

3.  **Build and start services**

    ```bash
    docker-compose up -d --build
    ```

4.  **Access the application**
    
    Open your browser at `http://localhost`.

## Service Architecture

- **nginx**: Reverse proxy (Port 80). Routes `/api` to backend and serves frontend.
- **frontend**: React application (internal).
- **backend**: Node.js/Express API (internal).
- **price-updater**: Go microservice.
- **mongodb**: Database with persistent volume.

## Useful Commands

### Check Logs

```bash
docker-compose logs -f
```

### Stop All Services

```bash
docker-compose down
```

### Run Database Seed

To populate the database with test data:

```bash
docker-compose exec backend npm run seed
```

## Production Considerations

> [!TIP]
> - **SSL/TLS**: Update Nginx config to use SSL certificates.
> - **Backups**: regularly backup the `mongodb_data` volume.
