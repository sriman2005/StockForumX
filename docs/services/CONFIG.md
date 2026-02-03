# Service Configuration

All Go microservices share a common configuration pattern using environment variables.

## Shared Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb://localhost:27017/stockforumx` | The full connection string for MongoDB. |

## Service-Specific Settings

### Analytics Service
- **Port**: `5001` (Exposed via Nginx as `/api/analytics`)
- **Timer**: Currently set to take snapshots every **5 minutes** (adjustable in `main.go` -> `startSnapshotWorker`).

### Oracle Service
- **Evaluation Loop**: Runs every **1 minute**.
- **Rewards**: 
  - `Correct`: +25 Reputation
  - `Incorrect`: -10 Reputation

### Price Updater
- **Concurrent Requests**: Limited by a semaphore (default 10) to avoid rate limits from data providers.

### Sentiment Service
- **Keywords**: Uses hardcoded word lists in `main.go`. In the future, these can be moved to a configuration file or database.

## Scaling Services
Since these services are stateless (relying on MongoDB for state), you can run multiple instances of:
- **Analytics Service** (Load balanced)
- **Sentiment Service** (Using Change Stream Resume Tokens)

> [!WARNING]
> Avoid running duplicate instances of the **Oracle Service** or **Price Updater** without a distributed lock mechanisms to prevent duplicate evaluations or external API spam.
