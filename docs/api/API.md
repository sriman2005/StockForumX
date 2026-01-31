# API Documentation

[← Back to Documentation Index](../README.md)

## Base URL

```text
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the **Authorization** header:

```http
Authorization: Bearer <your_jwt_token>
```

> [!IMPORTANT]
> Keep your JWT token secure. Do not expose it in client-side code repositories.

## Response Format

All API responses follow a consistent structure.

**Success Response:**

```json
{
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "error": "Error message description",
  "details": [ ... ]
}
```

---

## Authentication Endpoints

### Register User

Create a new user account.

`POST /auth/register`

**Request Body:**

```json
{
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "strongpassword123"
}
```

**Response:**

```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "username": "johndoe",
    "email": "john@example.com",
    "isVerified": false
  }
}
```

### Verify Email

Verify a user's email address using the OTP sent.

`POST /auth/verify-email`

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Login

Authenticate a user and receive a JWT.

`POST /auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "strongpassword123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "username": "johndoe",
    "email": "john@example.com",
    "reputation": 0
  }
}
```

### Get Current User

Retrieve the currently authenticated user's details.

`GET /auth/me`

> [!NOTE]
> Requires Authentication.

### Login with OTP (Init)

Initiate a passwordless login flow.

`POST /auth/login-otp-init`

**Body:**

```json
{
  "email": "john@example.com"
}
```

### Login with OTP (Verify)

Complete the passwordless login.

`POST /auth/login-otp-verify`

**Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Forgot Password

Request a password reset OTP.

`POST /auth/forgot-password`

**Body:**

```json
{
  "email": "john@example.com"
}
```

### Reset Password

Set a new password using the OTP.

`POST /auth/reset-password`

**Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

---

## Stock Endpoints

### Get All Stocks

Retrieve a list of available stocks.

`GET /stocks`

**Query Parameters:**
- `sector` (optional): Filter by sector (e.g., "Technology").
- `search` (optional): Search by name or symbol.

**Response:**

```json
{
  "stocks": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "sector": "Technology",
      "currentPrice": 150.25,
      "change": 2.50,
      "changePercent": 1.69
    }
  ]
}
```

### Get Stock Details

Retrieve detailed information for a specific stock.

`GET /stocks/:symbol`

**Response:**

```json
{
  "stock": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "Technology",
    "currentPrice": 150.25,
    "previousClose": 147.75,
    "volume": 52000000,
    "marketCap": 2500000000000,
    "high24h": 151.00,
    "low24h": 148.50,
    "description": "Apple Inc. designs, manufactures, and markets smartphones..."
  }
}
```

### Get Trending Questions for Stock

`GET /stocks/:symbol/trending`

**Query Parameters:**
- `limit` (optional, default: 5): Number of questions to retrieve.

---

## Question Endpoints

### Get Questions

Retrieve a list of questions based on filters.

`GET /questions`

**Query Parameters:**
- `stockId` (optional): Filter by stock ID.
- `userId` (optional): Filter by user ID.
- `tag` (optional): Filter by specific tag.
- `sort` (optional): Sort order (`recent`, `popular`, `unanswered`).
- `limit` (optional, default: 20).
- `page` (optional, default: 1).

### Get Question Details

Retrieve a single question and its answers.

`GET /questions/:id`

**Response:**

```json
{
  "question": {
    "id": "...",
    "title": "Is AAPL a good buy right now?",
    "content": "Given the recent earnings report...",
    "stockId": { ... },
    "userId": { ... },
    "tags": ["analysis", "long-term"],
    "upvotes": 15,
    "views": 120,
    "answerCount": 3,
    "answers": [ ... ]
  }
}
```

### Create Question

Post a new question.

`POST /questions`

> [!NOTE]
> Requires Authentication.

**Body:**

```json
{
  "stockId": "...",
  "title": "Is AAPL a good buy?",
  "content": "I'm considering buying AAPL...",
  "tags": ["analysis", "long-term"]
}
```

### Create Answer

Answer a specific question.

`POST /questions/:id/answers`

> [!NOTE]
> Requires Authentication.

**Body:**

```json
{
  "content": "Yes, AAPL is a solid long-term investment because..."
}
```

### Upvote Question

`PUT /questions/:id/upvote`

> [!NOTE]
> Requires Authentication.

### Downvote Question

`PUT /questions/:id/downvote`

> [!NOTE]
> Requires Authentication.

### Upvote Answer

`PUT /questions/answers/:answerId/upvote`

> [!NOTE]
> Requires Authentication.

### Downvote Answer

`PUT /questions/answers/:answerId/downvote`

> [!NOTE]
> Requires Authentication.

### Accept Answer

Mark an answer as accepted.

`PUT /questions/:questionId/answers/:answerId/accept`

> [!NOTE]
> Requires Authentication. Only the question author can perform this action.

---

## Prediction Endpoints

### Get Predictions

Retrieve recent market predictions.

`GET /predictions`

**Query Parameters:**
- `stockId` (optional): Filter by stock.
- `userId` (optional): Filter by user.
- `timeframe` (optional): `1h`, `1d`, `1w`, `1m`.
- `evaluated` (optional): `true`, `false`.
- `limit` (optional, default: 20).

### Create Prediction

Submit a new prediction.

`POST /predictions`

> [!NOTE]
> Requires Authentication.

**Body (Price Prediction):**

```json
{
  "stockId": "...",
  "predictionType": "price",
  "targetPrice": 160.00,
  "timeframe": "1w",
  "reasoning": "Based on recent earnings..."
}
```

**Body (Direction Prediction):**

```json
{
  "stockId": "...",
  "predictionType": "direction",
  "direction": "up",
  "timeframe": "1d",
  "reasoning": "Market sentiment is positive..."
}
```

### Get User Predictions

`GET /predictions/user/:userId`

### Get Prediction Stats

`GET /predictions/stats`

> [!NOTE]
> Requires Authentication.

**Response:**

```json
{
  "stats": {
    "totalPredictions": 50,
    "accuratePredictions": 35,
    "accuracy": 70,
    "byTimeframe": {
      "1h": { "total": 10, "accurate": 6 },
      "1d": { "total": 20, "accurate": 15 }
    }
  }
}
```

---

## User Endpoints

### Get Leaderboard

Retrieve top-ranked users.

`GET /users/leaderboard`

**Query Parameters:**
- `limit` (optional, default: 10).

**Response:**

```json
{
  "leaderboard": [
    {
      "username": "johndoe",
      "reputation": 250.5,
      "totalPredictions": 100,
      "accuracy": 75.5
    }
  ]
}
```

### Get User Profile

`GET /users/:userId`

**Response:**

```json
{
  "user": {
    "username": "johndoe",
    "fullName": "John Doe",
    "bio": "...",
    "reputation": 250.5,
    "totalPredictions": 100,
    "accuratePredictions": 75,
    "accuracy": 75.5,
    "tradingExperience": "intermediate",
    "location": "New York"
  }
}
```

### Get User Stats

`GET /users/:userId/stats`

### Update Profile

Update user profile information.

`PUT /users/profile`

> [!NOTE]
> Requires Authentication.

**Body:**

```json
{
  "fullName": "John Doe",
  "bio": "Experienced trader...",
  "location": "New York",
  "tradingExperience": "expert",
  "phone": "+1234567890"
}
```

---

## Health Check

### Check API Health

`GET /health`

**Response:**

```json
{
  "status": "ok",
  "message": "StockForumX API is running"
}
```

---

## Rate Limiting

> [!WARNING]
> To ensure fair usage, the API enforces rate limits.

- **Limit**: 100 requests per 15 minutes per IP.

**Response (when exceeded):**

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
