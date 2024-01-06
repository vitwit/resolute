package middleware

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
)

func (h *Handler) AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		signature := c.QueryParams().Get("signature")
		address := c.QueryParams().Get("address")

		if address == "" {
			return c.JSON(http.StatusNotAcceptable, model.ErrorResponse{
				Status:  "error",
				Message: "address is required",
			})
		}

		if signature == "" {
			return c.JSON(http.StatusNotAcceptable, model.ErrorResponse{
				Status:  "error",
				Message: "signature is required",
			})
		}

		var userAddress string

		saniSignature := strings.Replace(signature, " ", "+", -1)

		err := h.DB.QueryRow(`SELECT address FROM users where address=$1 and signature=$2`, address, saniSignature).Scan(&userAddress)
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "Unauthorized",
				Message: "Unauthorized access",
			})
		} else if err != nil {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode",
				Log:     err.Error(),
			})
		}

		return next(c)
	}
}

func (h *Handler) IsMultisigAdmin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		address := c.QueryParams().Get("address")
		multisigAddress := c.Param("address")

		var userAddress string

		err := h.DB.QueryRow(`SELECT address FROM multisig_accounts where created_by=$1 and address=$2`, address, multisigAddress).Scan(&userAddress)
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "Unauthorized",
				Message: err.Error(),
			})
		} else if err != nil {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode",
				Log:     err.Error(),
			})
		}

		return next(c)
	}
}

func (h *Handler) IsMultisigMember(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		address := c.QueryParams().Get("address")
		multisigAddress := c.Param("address")

		var userAddress string

		err := h.DB.QueryRow(`SELECT address FROM pubkeys where address=$1 and multisig_address=$2`, address, multisigAddress).Scan(&userAddress)
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "Unauthorized",
				Message: "You are not a member of the multisig",
			})
		} else if err != nil {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode",
				Log:     err.Error(),
			})
		}

		return next(c)
	}
}
