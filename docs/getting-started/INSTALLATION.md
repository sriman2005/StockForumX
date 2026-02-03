# Installation Guide

[← Back to Documentation Index](../README.md)

## Prerequisites

> [!IMPORTANT]
> Before you begin, ensure you have the following installed on your system.

- **Node.js**: v18 or higher
- **MongoDB**: v6 or higher
- **npm** or **yarn**
- **Git**

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd StockForumX
```

## Step 2: Install Dependencies

The project uses npm workspaces for managing client and server dependencies.

```bash
npm run install:all
```

Alternatively, you can install them manually:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Step 3: Set Up MongoDB

> [!TIP]
> If you don't want to install MongoDB locally, you can use the Docker setup which comes with a pre-configured database. See [Docker Deployment](../deployment/DOCKER.md).

### Local MongoDB

Start the MongoDB service.

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

Verify that MongoDB is running:
```bash
mongosh
```

### MongoDB Atlas (Cloud)

1.  Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new cluster.
3.  Get connection string.
4.  Use this string in your `.env` file.

## Step 4: Configure Environment Variables

Navigate to the server directory and copy the example file:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockforumx
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=StockForumX <noreply@stockforumx.com>
```

> [!WARNING]
> - Use a strong, random `JWT_SECRET` in production.
> - `EMAIL_*` variables are required for email verification and password reset functionality.
> - For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

## Step 5: Seed the Database (Optional)

> [!TIP]
> You can populate the database with sample data to quickly test the application.

```bash
cd server
npm run seed
```

This commands creates sample stocks, test users, questions, and predictions.

## Step 6: Start the Application

### Run Both Client and Server

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend**: [http://localhost:5000](http://localhost:5000)
- **Frontend**: [http://localhost:5173](http://localhost:5173)

### Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

## Step 7: Verify Installation

1.  Open your browser to [http://localhost:5173](http://localhost:5173).
2.  Check backend health at [http://localhost:5000/api/health](http://localhost:5000/api/health).

**Expected Response:**

```json
{
  "status": "ok",
  "message": "StockForumX API is running"
}
```

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError`

**Solutions:**
- Ensure MongoDB is running.
- Check the `MONGODB_URI` in your `.env` file.
- For Atlas, ensure your IP is whitelisted.

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solutions:**
- Change `PORT` in `server/.env`.
- Kill the process using the port:

  **Windows:**
  ```bash
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
  
  **macOS/Linux:**
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

### Dependencies Installation Failed

**Solutions:**
- Clear npm cache: `npm cache clean --force`.
- Delete `node_modules` and reinstall.
- Ensure you are using Node.js v18 or higher.
- Try with the `--legacy-peer-deps` flag.

### Email Features Not Working

**Solutions:**
- Verify `EMAIL_*` variables in `.env`.
- For Gmail, enable 2FA and use an App Password.
- Check firewall or antivirus software blocking SMTP.

## Next Steps

- Read the [Quick Start Guide](./QUICK_START.md) for basic features.
- Check the [Development Guide](../guides/DEVELOPMENT.md) for workflow information.
- See the [API Documentation](../api/API.md) for endpoint details.

## Production Deployment

For production deployment details, see the [Deployment Guide](../deployment/DEPLOYMENT.md).
