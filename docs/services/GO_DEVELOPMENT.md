# Go Development & Compilation Guide

The microservices in Stock Forum X are written in Go (Golang). This guide explains how to set up your environment, compile the code, and run these services.

## Prerequisites
- **Go 1.22+** installed on your system.
- **MongoDB** instance running (all services require a connection string).

## Compiling Go Services

Each service is located in its own folder under `/services/[service-name]`. They are standalone Go modules.

### 1. Manual Compilation (Standard)

To compile a service into a binary:

```bash
# Navigate to the service folder
cd services/alert-engine

# Download dependencies (defined in go.mod)
go mod download

# Build the executable
# On Windows:
go build -o service.exe main.go

# On Linux/macOS:
go build -o service main.go
```

### 2. Building for Production (Cross-Compilation)
If you are developing on Windows but deploying to a Linux server:

```bash
# Set environment variables for Linux
$env:GOOS="linux"; $env:GOARCH="amd64"
go build -o service_linux main.go
```

## Running Services

### Manual Method
Ensure your `.env` file in the `/server` folder has the correct `MONGODB_URI`.

```bash
cd services/alert-engine
go run main.go
```

### Docker Method (Recommended)
We use Multi-stage builds in our Dockerfiles to keep images small. To start all services at once:

```bash
# From the root directory
docker-compose up --build
```

Specific service build:
```bash
docker build -t stockforumx-oracle ./services/oracle-service
```

## Dependency Management
If you add new libraries to a service:
1. Run `go get [package_name]`
2. Run `go mod tidy` to clean up the `go.mod` and `go.sum` files.

## Common Issues
- **Change Stream Failures**: Most services require MongoDB to be running in **Replica Set** mode to support Change Streams.
- **Context Deadlines**: If a service fails to connect, verify your `MONGODB_URI` environment variable is accessible from the service's runtime.
