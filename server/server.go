// DONOTCOVER

package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"

	"github.com/vitwit/resolute/server/config"
	"github.com/vitwit/resolute/server/cron"
	"github.com/vitwit/resolute/server/handler"
	middle "github.com/vitwit/resolute/server/middleware"
	"github.com/vitwit/resolute/server/model"

	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func main() {
	e := echo.New()
	e.Logger.SetLevel(log.ERROR)
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	config, err := config.ParseConfig()
	if err != nil {
		log.Fatal(err)
	}

	cfg := config.DB
	apiCfg := config.API

	// TODO: add ssl support
	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DatabaseName)
	// open database
	db, err := sql.Open("postgres", psqlconn)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	// check db
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	// Initialize handler
	h := &handler.Handler{DB: db}
	m := &middle.Handler{DB: db}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	// Routes
	e.POST("/multisig", h.CreateMultisigAccount, m.AuthMiddleware)
	e.GET("/multisig/accounts/:address", h.GetMultisigAccounts)
	e.GET("/multisig/:address", h.GetMultisigAccount)
	e.POST("/multisig/:address/tx", h.CreateTransaction, m.AuthMiddleware, m.IsMultisigMember)
	e.GET("/multisig/:address/tx/:id", h.GetTransaction)
	e.POST("/multisig/:address/tx/:id", h.UpdateTransactionInfo, m.AuthMiddleware, m.IsMultisigMember)
	e.DELETE("/multisig/:address/tx/:id", h.DeleteTransaction, m.AuthMiddleware, m.IsMultisigAdmin)
	e.POST("/multisig/:address/sign-tx/:id", h.SignTransaction, m.AuthMiddleware, m.IsMultisigMember)
	e.GET("/multisig/:address/txs", h.GetTransactions)

	// users
	e.POST("/users/:address/signature", h.CreateUserSignature)
	e.GET("/users/:address", h.GetUser)

	e.GET("/tokens-info", h.GetTokensInfo)
	e.GET("/tokens-info/:denom", h.GetTokenInfo)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, model.SuccessResponse{
			Status:  "success",
			Message: "server up",
		})
	})
	e.RouteNotFound("*", func(c echo.Context) error {
		return c.JSON(http.StatusOK, model.ErrorResponse{
			Status:  "error",
			Message: "route not found",
		})
	})

	// Setup coingecko cron job
	cronClient := cron.NewCron(config, db)
	cronClient.Start()

	// Start server
	// TODO: add ip and port
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", apiCfg.Port)))
}
