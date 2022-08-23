package routes

import (
	"staking-server/controllers"

	"github.com/labstack/echo/v4"
)

func TxRoute(e *echo.Echo) {
	e.POST("/txs", controllers.CreateTxn)
	e.GET("/txs", controllers.GetTxns)
	e.GET("/txs/:txId", controllers.GetTxn)
	e.DELETE("/txs/:txId", controllers.DeleteTxn)
	e.POST("/txs/:txId/update", controllers.UpdateTxn)
}
