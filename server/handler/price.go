package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/cron"
	"github.com/vitwit/resolute/server/model"
	"github.com/vitwit/resolute/server/schema"
	"github.com/vitwit/resolute/server/utils"

	"github.com/vitwit/resolute/server/config"
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
		fmt.Printf("Error - %v ", err.Error())
		if sql.ErrNoRows.Error() == row.Scan().Error() {
			config, err := config.ParseConfig()
			if err != nil {
				log.Fatal(err)
			}

			priceInfo, err1 := cron.GetNSavePriceInfoFromCoin(config.COINGECKO.URI, denom)
			if err1 != nil {
				return c.JSON(http.StatusBadRequest, model.ErrorResponse{
					Status:  "error",
					Message: fmt.Sprintf("no token info: %s", denom),
					Log:     err1.Error(),
				})
			} else {
				for k, v := range priceInfo {
					val, _ := json.Marshal(v)
					_, err = h.DB.Exec("UPDATE price_info SET info=$1,last_updated=$2 WHERE denom=$3", val, time.Now(), priceInfo[k])
					if err != nil {
						utils.ErrorLogger.Printf("failed to update price information for denom = %s : %s\n", k, err.Error())
					}
				}
			}

			return c.JSON(http.StatusOK, model.SuccessResponse{
				Status: "success",
				Data:   priceInfo,
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
