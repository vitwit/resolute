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

var signCollection *mongo.Collection = config.GetCollection(config.DB, "signatures")
var signValidate = validator.New()

func CreateSign(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var signature models.Signature
	defer cancel()

	if err := c.Bind(&signature); err != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	if validationErr := signValidate.Struct(&signature); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.UserResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": validationErr.Error()},
		})
	}

	result, err := signCollection.InsertOne(ctx, signature)
	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{
				Status:  http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	err = UpdateTxnStatus(signature.TxId, "SIGNED", "", "")
	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{
				Status:  http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated,
		responses.UserResponse{Status: http.StatusCreated,
			Message: "success",
			Data:    &echo.Map{"data": result}})
}

func GetSignatures(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	var query bson.M

	txId := c.QueryParam("txId")

	objId, _ := primitive.ObjectIDFromHex(txId)
	if txId != "" {
		query = bson.M{
			"txid": objId,
		}
	}

	var signatures []models.Signature
	defer cancel()

	results, err := signCollection.Find(ctx, query)

	if err != nil {
		return c.JSON(http.StatusInternalServerError,
			responses.UserResponse{Status: http.StatusInternalServerError,
				Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	defer results.Close(ctx)

	for results.Next(ctx) {
		var signature models.Signature
		if err = results.Decode(&signature); err != nil {
			return c.JSON(http.StatusInternalServerError,
				responses.UserResponse{Status: http.StatusInternalServerError, Message: "error",
					Data: &echo.Map{"data": err.Error()}})
		}

		signatures = append(signatures, signature)
	}

	return c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": signatures}})
}
