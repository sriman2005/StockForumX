# Quick Start Guide

[← Back to Documentation Index](../README.md)

Get StockForumX running in 5 minutes.

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally

## Installation

```bash
# 1. Clone
git clone <your-repo-url>
cd StockForumX

# 2. Install
npm run install:all

# 3. Configure
cd server
cp .env.example .env

# 4. Seed (Optional)
npm run seed

# 5. Start
cd ..
npm run dev
```

> [!NOTE]
> Ensure MongoDB is running before starting the application.

## Access Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5000](http://localhost:5000)

## Test Account

If you ran the seed command, you can login with:

- **Email**: `test@example.com`
- **Password**: `password123`

## Quick Tour

1.  **Browse Stocks**: View live prices.
2.  **Ask Questions**: Engage with the community.
3.  **Make Predictions**: Test your market knowledge.
4.  **Real-time Chat**: Discuss stocks live.

## Need Help?

Check the [Troubleshooting Guide](../support/TROUBLESHOOTING.md) or open an issue on GitHub.
