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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/net/context"
)

var accountCollection *mongo.Collection = config.GetCollection(config.DB, "accounts")
var validate = validator.New()

func CreateAccount(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var account models.Account
	defer cancel()

	if err := c.Bind(&account); err != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	if validationErr := validate.Struct(&account); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": validationErr.Error()},
		})
	}

	// result, err := accountCollection.InsertOne(ctx, account)
	opts := options.Update().SetUpsert(true)
	filter := bson.D{{"address", account.Address}}
	update := bson.D{{"$set", account}}

	result, err := accountCollection.UpdateOne(ctx, filter, update, opts)

	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{
				Status:  http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated, responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &echo.Map{"data": result}})
}

func GetAccounts(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	address := c.Param("address")
	// var accounts []models.Account
	defer cancel()

	matchStage := bson.D{{"$match",
		bson.D{{"pubkeyjson.value.pubkeys.address", address}}}}

	lookupStage := bson.D{{"$lookup", bson.D{{"from", "txs"},
		{"let", bson.D{{"address", "$address"}}},
		{"pipeline", bson.A{
			bson.D{{
				"$match", bson.D{{
					"$expr", bson.D{{"$eq", bson.A{"$address", "$$address"}}},
				}},
			}},
			bson.D{{
				"$match", bson.D{{
					"status", bson.D{{
						"$in", bson.A{"PENDING", "SIGNED"},
					}},
				}},
			}},
		}},
		{"as", "txns"}}}}

	results, err := accountCollection.Aggregate(ctx, mongo.Pipeline{matchStage, lookupStage})
	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{Status: http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})

	}

	var accounts []bson.M
	if err = results.All(ctx, &accounts); err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{Status: http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK,
		Message: "success", Data: &echo.Map{"data": accounts}})
}

func GetMultisigAccount(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	address := c.Param("address")
	var account models.Account
	defer cancel()

	err := accountCollection.FindOne(ctx, bson.M{
		"address": address,
	}).Decode(&account)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": account}})

}
