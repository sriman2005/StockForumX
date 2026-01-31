# Deployment Guide

[← Back to Documentation Index](../README.md)

## Production Checklist

Before deploying to production, ensure you have checked the following:

- [ ] Environment variables configured
- [ ] HTTPS/SSL certificates installed
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Monitoring setup

## Deployment Options

### Option 1: Docker (Recommended)

For a modern, containerized deployment, please refer to our dedicated guide:

[**Docker Deployment Guide**](./DOCKER.md)

This setup includes:
- Nginx reverse proxy for SSL.
- Database persistence.
- Orchestration with Docker Compose.

---

### Option 2: Traditional VPS (Ubuntu)

#### Prerequisites
- Ubuntu 20.04+ server
- Node.js v18+
- MongoDB v6+
- Nginx
- PM2

#### Steps

1.  **Clone and Setup**:
    ```bash
    git clone <your-repo-url> /var/www/stockforumx
    cd /var/www/stockforumx
    npm run install:all
    cd client && npm run build
    ```

2.  **Environment Variables**:
    Create `.env` in `server/` with production values.

    > [!WARNING]
    > Ensure `NODE_ENV=production` and use a strong `JWT_SECRET`.

3.  **Start with PM2**:
    ```bash
    cd server
    pm2 start index.js --name stockforumx-api
    ```

4.  **Configure Nginx**:
    Set up Nginx as a reverse proxy to forward port 80/443 to your Node.js app (port 5000) and serve static frontend files.

---

### Option 3: Cloud Platforms (Heroku/Render/Railway)

1.  **Connect Repository**: Link your GitHub repo.
2.  **Build Command**: `cd client && npm install && npm run build` (if deploying full stack).
3.  **Start Command**: `cd server && node index.js`.
4.  **Environment Variables**: Add them in the platform's dashboard.

## Environment Variables

### Required

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<strong-random-string>
CLIENT_URL=<your-frontend-url>
```

### Optional

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<app-password>
```

## Security Checklist

> [!IMPORTANT]
> - **HTTPS**: Always enable SSL.
> - **Secrets**: Never commit `.env` files.
> - **Rate Limiting**: Enable strict rate limits for public APIs.
> - **Headers**: Use security headers (Helmet.js).
