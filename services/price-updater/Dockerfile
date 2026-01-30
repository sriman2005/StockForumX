FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy generic go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o price-updater main.go

# Production stage
FROM alpine:latest

WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/price-updater .

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

CMD ["./price-updater"]
