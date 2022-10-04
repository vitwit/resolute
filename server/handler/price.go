package handler

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
	"github.com/vitwit/resolute/server/schema"
)

func (h *Handler) GetTokensInfo(c echo.Context) error {
	rows, err := h.DB.Query(`SELECT denom,coingecko_name,enabled,last_updated,info 
	FROM price_info`)
	if err != nil {
		if rows != nil && sql.ErrNoRows == rows.Err() {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: "no coins info",
				Log:     rows.Err().Error(),
			})
		}

		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to query coins info",
			Log:     err.Error(),
		})
	}

	priceInfos := make([]schema.PriceInfo, 0)
	for rows.Next() {
		var priceInfo schema.PriceInfo
		if err := rows.Scan(
			&priceInfo.Denom,
			&priceInfo.CoingeckoName,
			&priceInfo.Enabled,
			&priceInfo.LastUpdated,
			&priceInfo.Info,
		); err != nil {
			return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Status:  "error",
				Message: "failed to get price info",
				Log:     err.Error(),
			})
		}

		priceInfos = append(priceInfos, priceInfo)
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "success",
		Data:   priceInfos,
	})

}

func (h *Handler) GetTokenInfo(c echo.Context) error {
	denom := c.Param("denom")

	row := h.DB.QueryRow(`SELECT denom,coingecko_name,enabled,last_updated,info 
	FROM price_info WHERE denom=$1`, denom)
	var priceInfo schema.PriceInfo
	if err := row.Scan(
		&priceInfo.Denom,
		&priceInfo.CoingeckoName,
		&priceInfo.Enabled,
		&priceInfo.LastUpdated,
		&priceInfo.Info,
	); err != nil {
		if sql.ErrNoRows.Error() == row.Scan().Error() {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("no token info: %s", denom),
				Log:     row.Scan().Error(),
			})
		}

		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to query transaction",
			Log:     row.Err().Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "success",
		Data:   priceInfo,
	})
}
