package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"

	"database/sql"
	"fmt"

	_ "github.com/lib/pq"

	"github.com/vitwit/resolute/server/handler"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "alice"
	password = "password"
	dbname   = "multisig"
)

func main() {
	e := echo.New()
	e.Logger.SetLevel(log.ERROR)
	e.Use(middleware.Logger())

	// connection string
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

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

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	// Routes
	e.POST("/multisig", h.CreateMultisigAccount)
	e.GET("/accounts/:address", h.GetMultisigAccounts)
	e.GET("/multisig/:address", h.GetMultisigAccount)
	e.POST("/multisig/:address/tx", h.CreateTransaction)
	// e.POST("/follow/:id", h.Follow)
	// e.POST("/posts", h.CreatePost)
	// e.GET("/feed", h.FetchPost)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}
