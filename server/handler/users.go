package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
	"github.com/vitwit/resolute/server/schema"
)

func (h *Handler) GetUser(c echo.Context) error {
	address := c.Param("address")

	row := h.DB.QueryRow(`SELECT address, signature, pub_key FROM users where address=$1`, address)

	var userDetails schema.Users

	if err := row.Scan(
		&userDetails.Address,
		&userDetails.Signature,
		&userDetails.PubKey,
	); err != nil {
		return c.JSON(http.StatusOK, model.SuccessResponse{
			Data: nil,
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Data: userDetails,
	})
}

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

	var userAddess string

	err = h.DB.QueryRow(`SELECT address FROM users where address=$1`, req.Address).Scan(&userAddess)
	if err == sql.ErrNoRows {
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
	} else if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to decode",
			Log:     err.Error(),
		})
	}

	err = h.DB.QueryRow(`UPDATE "users" SET signature=$1, salt=$2, created_at=$3 WHERE address=$4`,
		req.Signature, req.Salt, time.Now(), req.Address,
	).Err()
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
