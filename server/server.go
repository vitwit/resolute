// DONOTCOVER

package main

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"

	"github.com/vitwit/resolute/server/clients"
	"github.com/vitwit/resolute/server/config"
	"github.com/vitwit/resolute/server/cron"
	"github.com/vitwit/resolute/server/handler"
	middle "github.com/vitwit/resolute/server/middleware"
	"github.com/vitwit/resolute/server/model"

	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func init() {
	config, err := config.ParseConfig()
	if err != nil {
		log.Fatal(err)
	}
	// Initialize the Redis client
	clients.InitializeRedis(config.REDIS_URI, "", 0)
}

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

	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(5)

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
	e.DELETE("/multisig/:address", h.DeleteMultisigAccount, m.AuthMiddleware, m.IsMultisigAdmin)
	e.POST("/multisig/:address/tx", h.CreateTransaction, m.AuthMiddleware, m.IsMultisigMember)
	e.GET("/multisig/:address/tx/:id", h.GetTransaction)
	e.POST("/multisig/:address/tx/:id", h.UpdateTransactionInfo, m.AuthMiddleware, m.IsMultisigMember)
	e.DELETE("/multisig/:address/tx/:id", h.DeleteTransaction, m.AuthMiddleware, m.IsMultisigAdmin)
	e.POST("/multisig/:address/sign-tx/:id", h.SignTransaction, m.AuthMiddleware, m.IsMultisigMember)
	e.GET("/multisig/:address/txs", h.GetTransactions)
	e.GET("/accounts/:address/all-txns", h.GetAllMultisigTxns)
	e.POST("/transactions", h.GetRecentTransactions)
	e.GET("/txns/:chainId/:address", h.GetAllTransactions)

	// users
	e.POST("/users/:address/signature", h.CreateUserSignature)
	e.GET("/users/:address", h.GetUser)

	e.GET("/tokens-info", h.GetTokensInfo)
	e.GET("/tokens-info/:denom", h.GetTokenInfo)

	e.POST("/cosmos/tx/v1beta1/txs", proxyHandler1)

	e.Any("/*", proxyHandler)

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

func proxyHandler1(c echo.Context) error {
	config, err := config.ParseConfig()
	if err != nil {
		log.Fatal(err)
	}

	type RequestBody struct {
		Mode    string `json:"mode"`
		TxBytes string `json:"tx_bytes"`
	}

	reqBody := new(RequestBody)

	// Bind the request body to the struct
	if err := c.Bind(reqBody); err != nil {
		return c.String(http.StatusBadRequest, "Invalid request")
	}

	// Convert the struct to JSON
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error encoding JSON")
	}

	chanDetails := clients.GetChain(c.QueryParam("chain"))
	// URL to which the POST request will be sent
	targetURL := chanDetails.RestURI + "/cosmos/tx/v1beta1/txs"

	// Create a new HTTP request
	req, err := http.NewRequest("POST", targetURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error creating request")
	}

	// Set the Content-Type header
	req.Header.Set("Content-Type", "application/json")

	authorizationToken := fmt.Sprintf("Bearer %s", config.MINTSCAN_TOKEN.Token)
	req.Header.Add("Authorization", authorizationToken) // Change this to your actual token

	// Create a new HTTP client and send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error sending request")
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Error reading response")
	}

	// Respond back to the original request
	return c.JSON(http.StatusOK, string(body))
}

func proxyHandler(c echo.Context) error {
	config, err := config.ParseConfig()
	if err != nil {
		log.Fatal(err)
	}

	chanDetails := clients.GetChain(c.QueryParam("chain"))

	// Construct the target URL based on the incoming request
	targetBase := chanDetails.RestURI // Change this to your target service base URL

	targetURL := targetBase + c.Request().URL.Path
	if c.Request().URL.RawQuery != "" {
		targetURL += "?" + c.Request().URL.RawQuery
	}

	// Create a new request to the target URL
	req, err := http.NewRequest(c.Request().Method, targetURL, c.Request().Body)
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return c.String(http.StatusInternalServerError, "Failed to create request")
	}
	// Forward headers from the original request
	for name, values := range c.Request().Header {
		for _, value := range values {
			req.Header.Add(name, value)
		}
	}
	req.Header.Set("Content-Type", "application/json")
	// Add Authorization header
	authorizationToken := fmt.Sprintf("Bearer %s", config.MINTSCAN_TOKEN.Token)
	req.Header.Add("Authorization", authorizationToken) // Change this to your actual token

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to make request: %v", err)
		return c.String(http.StatusInternalServerError, "Failed to make request")
	}
	defer resp.Body.Close()

	c.Response().WriteHeader(resp.StatusCode)

	// Copy the response body to the original response
	_, err = io.Copy(c.Response().Writer, resp.Body)
	if err != nil {
		log.Printf("Failed to read response body: %v", err)
		return c.String(http.StatusInternalServerError, "Failed to read response body")
	}

	return nil
}
