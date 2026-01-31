package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Stock struct {
	ID             primitive.ObjectID `bson:"_id"`
	Symbol         string             `bson:"symbol"`
	SentimentScore float64            `bson:"sentimentScore"`
	SentimentLabel string             `bson:"sentimentLabel"`
}

type ForumPost struct {
	StockId primitive.ObjectID `bson:"stockId"`
	Title   string             `bson:"title"`
	Content string             `bson:"content"`
}

var (
	bullishWords = []string{"buy", "bullish", "moon", "long", "undervalued", "growth", "high", "good", "great", "win", "profit", "up", "call", "green"}
	bearishWords = []string{"sell", "bearish", "crash", "short", "overvalued", "dump", "low", "bad", "terrible", "loss", "down", "put", "red", "bankrupt"}
)

func main() {
	if err := godotenv.Load("../../server/.env"); err != nil {
		log.Println("Warning: Could not load .env file")
	}

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/stockforumx"
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("stockforumx")
	
	fmt.Println("Sentiment Service started. Watching forum posts...")

	// Watch Questions and Answers
	go watchCollection(db, "questions")
	go watchCollection(db, "answers")

	// Keep alive
	select {}
}

func watchCollection(db *mongo.Database, collName string) {
	coll := db.Collection(collName)
	
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "operationType", Value: "insert"}}}},
	}
	
	opts := options.ChangeStream().SetFullDocument(options.UpdateLookup)
	stream, err := coll.Watch(context.Background(), pipeline, opts)
	if err != nil {
		log.Fatalf("Watch %s failed: %v", collName, err)
	}
	defer stream.Close(context.Background())

	for stream.Next(context.Background()) {
		var event struct {
			FullDocument bson.M `bson:"fullDocument"`
		}
		if err := stream.Decode(&event); err != nil {
			log.Printf("Decode error: %v", err)
			continue
		}

		// Handle both questions (has stockId) and answers (has questionId -> need to find stockId)
		var stockId primitive.ObjectID
		var text string

		if collName == "questions" {
			if sid, ok := event.FullDocument["stockId"].(primitive.ObjectID); ok {
				stockId = sid
			}
			text = fmt.Sprintf("%v %v", event.FullDocument["title"], event.FullDocument["content"])
		} else {
			// Answer - find question to get stockId
			qid := event.FullDocument["questionId"].(primitive.ObjectID)
			var q struct {
				StockId primitive.ObjectID `bson:"stockId"`
			}
			err := db.Collection("questions").FindOne(context.Background(), bson.M{"_id": qid}).Decode(&q)
			if err == nil {
				stockId = q.StockId
			}
			text = fmt.Sprintf("%v", event.FullDocument["content"])
		}

		if !stockId.IsZero() {
			processSentiment(db, stockId, text)
		}
	}
}

func processSentiment(db *mongo.Database, stockId primitive.ObjectID, text string) {
	score := analyzeText(text)
	fmt.Printf("Analyzing text for Stock %s. Score: %d\n", stockId.Hex(), score)

	// Get current stock sentiment and update
	stocksColl := db.Collection("stocks")
	var stock Stock
	err := stocksColl.FindOne(context.Background(), bson.M{"_id": stockId}).Decode(&stock)
	if err != nil {
		return
	}

	// Simple moving average sentiment update
	newScore := (stock.SentimentScore * 0.7) + (float64(50+score*10) * 0.3)
	if newScore > 100 { newScore = 100 }
	if newScore < 0 { newScore = 0 }

	label := "Neutral"
	if newScore > 80 { label = "Bullish" } else if newScore > 60 { label = "Somewhat Bullish" } else if newScore < 20 { label = "Bearish" } else if newScore < 40 { label = "Somewhat Bearish" }

	_, err = stocksColl.UpdateOne(
		context.Background(),
		bson.M{"_id": stockId},
		bson.M{"$set": bson.M{
			"sentimentScore": newScore,
			"sentimentLabel": label,
		}},
	)
	if err != nil {
		log.Printf("Failed to update stock sentiment: %v", err)
	}
}

func analyzeText(text string) int {
	text = strings.ToLower(text)
	score := 0
	
	for _, word := range bullishWords {
		if strings.Contains(text, word) {
			score++
		}
	}
	
	for _, word := range bearishWords {
		if strings.Contains(text, word) {
			score--
		}
	}
	
	return score
}
