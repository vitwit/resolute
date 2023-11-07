package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
)

func (h *Handler) CreateUserSignature(c echo.Context) error {
	address := c.Param("address")

	req := &model.CreateUserSignature{}
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to decode request",
			Log:     err.Error(),
		})
	}

	if err := req.Validate(); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
			Log:     err.Error(),
		})
	}

	pubKeyBytes, err := json.Marshal(req.PubKey)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to decode pubkeys",
			Log:     err.Error(),
		})
	}

	var id int

	err = h.DB.QueryRow(`INSERT INTO "users"("address","salt","signature", "pub_key","created_at") 
	VALUES
	 ($1,$2,$3,$4, $5) RETURNING "id"`,
		address, req.Salt, req.Signature, pubKeyBytes, time.Now(),
	).Scan(&id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to store user",
			Log:     err.Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status:  "success",
		Message: "signature created",
	})
}
