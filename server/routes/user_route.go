package routes

import (
	"staking-server/controllers"
	"github.com/labstack/echo/v4"
)

func UserRoute(e *echo.Echo) {
	e.POST("/accounts", controllers.CreateAccount)
	e.GET("/accounts/:address", controllers.GetAccounts)
	e.GET("/multisig/accounts/:address", controllers.GetMultisigAccount)
}