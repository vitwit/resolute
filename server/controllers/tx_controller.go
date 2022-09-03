package controllers

import (
	"staking-server/config"
	"staking-server/models"
	"staking-server/responses"

	"go.mongodb.org/mongo-driver/bson"

	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/net/context"
)

type TxnRequest struct {
	Status string `json:"status"`
	Hash   string `json:"hash"`
}

var txCollection *mongo.Collection = config.GetCollection(config.DB, "txs")
var txValidate = validator.New()

func UpdateTxnStatus(txId primitive.ObjectID, status string, hash string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	query := bson.M{
		"_id": txId,
	}

	var updateObj bson.M

	if hash != "" {
		updateObj = bson.M{
			"$set": bson.M{
				"status": status,
				"hash":   hash,
			},
		}
	} else {
		updateObj = bson.M{
			"$set": bson.M{
				"status": status,
			},
		}
	}

	_, err := txCollection.UpdateOne(ctx, query, updateObj)
	return err
}

func CreateTxn(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var txn models.Transactions
	defer cancel()

	if err := c.Bind(&txn); err != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	txn.Status = "PENDING"
	txn.Timestamp = time.Now()

	if validationErr := txValidate.Struct(&txn); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": validationErr.Error()},
		})
	}

	result, err := txCollection.InsertOne(ctx, txn)
	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{
				Status:  http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated, responses.UserResponse{
		Status:  http.StatusCreated,
		Message: "success",
		Data:    &echo.Map{"data": result}})
}

func UpdateTxn(c echo.Context) error {
	_, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var req TxnRequest
	defer cancel()

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	txId := c.Param("txId")
	objId, _ := primitive.ObjectIDFromHex(txId)

	err := UpdateTxnStatus(objId, req.Status, req.Hash)

	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{
				Status:  http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated,
		responses.UserResponse{Status: http.StatusCreated,
			Message: "success"})

}

func GetTxns(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	address := c.QueryParam("address")
	status := c.QueryParam("status")

	var aggQuery mongo.Pipeline

	var statusStatge bson.D

	if status != "" {
		if status != "current" {
			statusStatge = bson.D{{"$match", bson.D{{"status",
				bson.D{{
					"$in", bson.A{"DONE", "FAILED"},
				}}}}}}
		} else {
			statusStatge = bson.D{{"$match", bson.D{{"status",
				bson.D{{
					"$in", bson.A{"PENDING", "SIGNED"},
				}}}}}}
		}

	}

	aggQuery = append(aggQuery, statusStatge)

	matchStage := bson.D{{"$match", bson.D{{"address", address}}}}
	aggQuery = append(aggQuery, matchStage)
	var arrLookupPipe = bson.A{}

	arrLookupPipe = append(arrLookupPipe, bson.D{{
		"$match", bson.D{{
			"$expr", bson.D{{
				"$and", bson.A{
					bson.D{{"$eq", bson.A{"$txid", "$$txnId"}}},
				},
			}},
		}},
	}})

	arrLookupPipe = append(arrLookupPipe, bson.D{{
		"$project", bson.D{{
			"address", 1,
		}, {
			"signature", 1,
		}, {
			"bodybytes", 1,
		}},
	}})

	lookupStage := bson.D{{
		"$lookup", bson.D{
			{
				"from", "signatures",
			},
			{
				"let", bson.D{{"txnId", "$_id"}},
			},
			{
				"pipeline", arrLookupPipe,
			},
			{
				"as", "signatures",
			},
		},
	}}
	// lookupStage := bson.D{{"$lookup", bson.D{
	// 	{"from", "signatures"},
	// 	{"localField", "_id"},
	// 	{"foreignField", "txid"},
	// 	{"as", "signatures"}}}}
	aggQuery = append(aggQuery, lookupStage)
	sortStage := bson.D{{"$sort", bson.D{{"timestamp", -1}}}}
	aggQuery = append(aggQuery, sortStage)

	results, err := txCollection.Aggregate(ctx, aggQuery)
	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{Status: http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})

	}

	var allTxs []bson.M
	if err = results.All(ctx, &allTxs); err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{Status: http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": allTxs}})
}

func DeleteTxn(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	txId := c.Param("txId")
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(txId)

	_, err := txCollection.DeleteOne(ctx, bson.M{"_id": objId})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success"})
}

func GetTxn(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	txId := c.Param("txId")
	var txn models.Transactions
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(txId)

	err := txCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&txn)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": txn}})
}
