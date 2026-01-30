package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Stock struct {
	ID           interface{} `bson:"_id"`
	Symbol       string      `bson:"symbol"`
	CurrentPrice float64     `bson:"currentPrice"`
}

var (
	mongoURI string
)

func main() {
	// Load .env
	if err := godotenv.Load("../../server/.env"); err != nil {
		log.Println("Warning: Could not load .env file, checking environment variables")
	}

	mongoURI = os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/stockforumx"
	}

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Connection failed:", err)
	}
	defer client.Disconnect(context.Background())

	fmt.Println("Connected to MongoDB at", mongoURI)

	// Get Collection
	collection := client.Database("stockforumx").Collection("stocks")

	// 1. Fetch all stocks
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(context.Background())

	var stocks []Stock
	if err = cursor.All(context.Background(), &stocks); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Found %d stocks to update...\n", len(stocks))

	// 2. Worker Pool for Concurrent Updates
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 10) // Limit to 10 concurrent requests

	startTime := time.Now()

	for _, stock := range stocks {
		wg.Add(1)
		semaphore <- struct{}{} // Acquire token

		go func(s Stock) {
			defer wg.Done()
			defer func() { <-semaphore }() // Release token

			// Random jitter to avoid 429s (0.5s to 2.5s delay)
			time.Sleep(time.Millisecond * time.Duration(500+rand.Intn(2000)))

			// Fetch real price
			price, err := fetchPrice(s.Symbol)
			if err != nil {
				log.Printf("Failed to fetch %s: %v", s.Symbol, err)
				return
			}
			
			// Update DB
			updateStockPrice(collection, s, price)
		}(stock)
	}

	wg.Wait()
	duration := time.Since(startTime)

	fmt.Printf("Updated %d stocks in %v\n", len(stocks), duration)
}

// Yahoo Finance Response Structs
type YahooResponse struct {
	Chart struct {
		Result []struct {
			Meta struct {
				RegularMarketPrice float64 `json:"regularMarketPrice"`
			} `json:"meta"`
		} `json:"result"`
	} `json:"chart"`
}

func fetchPrice(symbol string) (float64, error) {
	url := fmt.Sprintf("https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=1d&range=1d", symbol)
	
	resp, err := http.Get(url)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return 0, fmt.Errorf("status code %d", resp.StatusCode)
	}

	var data YahooResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return 0, err
	}

	if len(data.Chart.Result) == 0 {
		return 0, fmt.Errorf("no data found")
	}

	return data.Chart.Result[0].Meta.RegularMarketPrice, nil
}

func updateStockPrice(collection *mongo.Collection, s Stock, newPrice float64) {
	_, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": s.ID},
		bson.M{
			"$set": bson.M{
				"currentPrice": newPrice,
				"updatedAt":    time.Now(),
			},
		},
	)

	if err != nil {
		log.Printf("Failed to DB update %s: %v\n", s.Symbol, err)
	} else {
		fmt.Printf("✓ Updated %s: $%.2f -> $%.2f\n", s.Symbol, s.CurrentPrice, newPrice)
	}
}
