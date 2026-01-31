package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Prediction struct {
	ID             primitive.ObjectID `bson:"_id"`
	StockId        primitive.ObjectID `bson:"stockId"`
	UserId         primitive.ObjectID `bson:"userId"`
	PredictionType string             `bson:"predictionType"`
	TargetPrice    float64            `bson:"targetPrice"`
	Direction      string             `bson:"direction"`
	TargetDate     time.Time          `bson:"targetDate"`
	InitialPrice   float64            `bson:"initialPrice"`
	IsEvaluated    bool               `bson:"isEvaluated"`
}

type Stock struct {
	ID           primitive.ObjectID `bson:"_id"`
	Symbol       string             `bson:"symbol"`
	CurrentPrice float64            `bson:"currentPrice"`
}

type Notification struct {
	Recipient primitive.ObjectID `bson:"recipient"`
	Type      string             `bson:"type"`
	Content   string             `bson:"content"`
	IsRead    bool               `bson:"isRead"`
	CreatedAt time.Time          `bson:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt"`
}

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
	fmt.Println("Prediction Oracle started. Scanning for pending predictions...")

	// Run evaluation every minute
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	evaluatePredictions(db) // Internal immediate run

	for range ticker.C {
		evaluatePredictions(db)
	}
}

func evaluatePredictions(db *mongo.Database) {
	fmt.Println("🔍 Scanning for due predictions...")
	now := time.Now()

	predColl := db.Collection("predictions")
	stockColl := db.Collection("stocks")
	userColl := db.Collection("users")
	notifColl := db.Collection("notifications")

	// Filter: Not evaluated AND target date passed
	filter := bson.M{
		"isEvaluated": false,
		"targetDate":  bson.M{"$lte": now},
	}

	cursor, err := predColl.Find(context.Background(), filter)
	if err != nil {
		log.Printf("Failed to fetch predictions: %v", err)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var pred Prediction
		if err := cursor.Decode(&pred); err != nil {
			continue
		}

		// Get latest stock price
		var stock Stock
		err := stockColl.FindOne(context.Background(), bson.M{"_id": pred.StockId}).Decode(&stock)
		if err != nil {
			log.Printf("Failed to find stock %v: %v", pred.StockId, err)
			continue
		}

		isCorrect := false
		if pred.PredictionType == "price" {
			// Significant Price target reached? (Using current price at expiry)
			// A more advanced version would check historical peaks, but here we check status at expiry.
			if pred.TargetPrice > pred.InitialPrice && stock.CurrentPrice >= pred.TargetPrice {
				isCorrect = true
			} else if pred.TargetPrice < pred.InitialPrice && stock.CurrentPrice <= pred.TargetPrice {
				isCorrect = true
			}
		} else {
			// Directional check
			if pred.Direction == "up" && stock.CurrentPrice > pred.InitialPrice {
				isCorrect = true
			} else if pred.Direction == "down" && stock.CurrentPrice < pred.InitialPrice {
				isCorrect = true
			}
		}

		resolvePrediction(db, predColl, userColl, notifColl, pred, stock, isCorrect)
	}
}

func resolvePrediction(db *mongo.Database, predColl, userColl, notifColl *mongo.Collection, pred Prediction, stock Stock, isCorrect bool) {
	repChange := 25
	status := "CORRECT"
	if !isCorrect {
		repChange = -10
		status = "INCORRECT"
	}

	fmt.Printf("Resolution: %s prediction for %s is %s (User: %s)\n", pred.PredictionType, stock.Symbol, status, pred.UserId.Hex())

	// 1. Update Prediction
	_, _ = predColl.UpdateOne(context.Background(), bson.M{"_id": pred.ID}, bson.M{
		"$set": bson.M{
			"isEvaluated": true,
			"isCorrect":   isCorrect,
			"actualPrice": stock.CurrentPrice,
		},
	})

	// 2. Update User Reputation
	_, _ = userColl.UpdateOne(context.Background(), bson.M{"_id": pred.UserId}, bson.M{
		"$inc": bson.M{
			"reputation":          repChange,
			"totalPredictions":    1,
			"accuratePredictions": ternary(isCorrect, 1, 0),
		},
	})

	// 3. Send Notification
	content := fmt.Sprintf("Your %s prediction for %s was %s! %d points.", 
		pred.PredictionType, stock.Symbol, status, repChange)
	
	now := time.Now()
	_, _ = notifColl.InsertOne(context.Background(), Notification{
		Recipient: pred.UserId,
		Type:      "SYSTEM",
		Content:   content,
		IsRead:    false,
		CreatedAt: now,
		UpdatedAt: now,
	})
}

func ternary(cond bool, a, b int) int {
	if cond { return a }
	return b
}
