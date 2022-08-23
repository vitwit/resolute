package routes

import (
	"staking-server/controllers"
	"github.com/labstack/echo/v4"
)

func SignRoute(e *echo.Echo) {
	e.POST("/signs", controllers.CreateSign)
	e.GET("/signs", controllers.GetSignatures)
}