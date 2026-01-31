# StockForumX Backend

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

The core API and real-time server for StockForumX.

## Features

- **REST API**: For users, stocks, questions, and predictions.
- **WebSocket Server**: Real-time events for chat and updates.
- **Background Jobs**: Cron jobs for reputation and prediction evaluation.
- **Authentication**: JWT-based secure auth with email verification.

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB v6+

### Installation

```bash
cd server
npm install
```

### Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockforumx
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

> [!WARNING]
> Keep `JWT_SECRET` secure and never commit `.env`.

### Running Locally

```bash
npm run dev
```

Server will start on [http://localhost:5000](http://localhost:5000).

## Scripts

- `npm run dev`: Start with Nodemon (auto-reload).
- `npm start`: Start production server.
- `npm run seed`: Populate database with mock data.
- `npm test`: Run test suite.

## Architecture

```text
server/
├── models/       # Mongoose Schemas
├── routes/       # API Endpoints
├── sockets/      # WebSocket Handlers
├── jobs/         # Scheduled Tasks
├── middleware/   # Auth & Validation
└── utils/        # Helpers
```

## API Documentation

> [!TIP]
> See the full [API Documentation](../docs/api/API.md) for detailed endpoint descriptions.
