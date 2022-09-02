package main

import (
	"net/http"
	"staking-server/config"
	"staking-server/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	config.ConnectDB()

	routes.UserRoute(e)
	routes.SignRoute(e)
	routes.TxRoute(e)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, &echo.Map{"data": "Hello from Echo & mongoDB"})
	})

	e.Logger.Fatal(e.Start(":1323"))
}
