# Price Updater Service

![Go](https://img.shields.io/badge/-Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![MongoDB Driver](https://img.shields.io/badge/-MongoDB_Driver-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Concurrency](https://img.shields.io/badge/-Goroutines-blue?style=for-the-badge)

A high-performance microservice written in **Go (Golang)** responsible for fetching and updating stock prices in real-time.

## Overview

This service runs independently from the main Node.js backend to handle the high-throughput task of price updates. It connects directly to the shared MongoDB database.

## Prerequisites

- **Go**: v1.20+
- **MongoDB**: Access to the shared database.

## Setup

1.  **Navigate to directory**:
    ```bash
    cd services/price-updater
    ```

2.  **Install dependencies**:
    ```bash
    go mod download
    ```

## Running the Service

```bash
go run main.go
```

> [!NOTE]
> The service assumes the MongoDB instance is available at `mongodb://localhost:27017`. Check `main.go` to configure connection strings via environment variables if needed.

## Architecture

- **Goroutines**: Uses concurrent routines to simulate/fetch updates for multiple stocks simultaneously.
- **Direct DB Access**: Writes directly to the `Stocks` collection for minimal latency.

> [!IMPORTANT]
> Ensure this service is running to see "live" price changes in the application.
