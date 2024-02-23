package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
	"github.com/vitwit/resolute/server/txn_types"
	"github.com/vitwit/resolute/server/utils"
)

type ChainAddress struct {
	ChainId string `json:"chain_id"`
	Address string `json:"address"`
}

type GetRecentTransactionsRequest struct {
	Addresses []ChainAddress `json:"addresses"`
}

func (h *Handler) GetRecentTransactions(c echo.Context) error {
	module := c.QueryParams().Get("module")
	req := &GetRecentTransactionsRequest{}

	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}
	result := []txn_types.ParsedTxn{}
	for i := 0; i < len(req.Addresses); i++ {
		res, err := getNetworkRecentTransactions(req.Addresses[i].ChainId, module, req.Addresses[i].Address)
		if err == nil {
			parsedTxns, err := GetParsedTransactions(*res, req.Addresses[i].ChainId)
			if err == nil {
				result = append(result, parsedTxns...)
			}
		}

	}

	sort.Sort(ByTimestamp(result))

	recentTxns := result[:min(5, len(result))]

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "done",
		Data:   recentTxns,
	})
}

func getNetworkRecentTransactions(chainId string, module string, address string) (*txn_types.TransactionResponses, error) {
	var bearer = "Bearer " + "sk_28d9ca62e0a2415fa93d0ad09f27cc78"
	networkURIs := utils.GetChainAPIs(chainId)
	requestURI := utils.CreateRequestURI(networkURIs[0], module, address)
	req, _ := http.NewRequest("GET", requestURI, nil)
	req.Header.Add("Authorization", bearer)
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result txn_types.TransactionResponses
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

type ByTimestamp []txn_types.ParsedTxn

func (a ByTimestamp) Len() int           { return len(a) }
func (a ByTimestamp) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByTimestamp) Less(i, j int) bool { return a[i].Timestamp.After(a[j].Timestamp) }

func GetParsedTransactions(txns txn_types.TransactionResponses, chainId string) ([]txn_types.ParsedTxn, error) {
	layout := "2006-01-02T15:04:05Z"
	parsedTxns := []txn_types.ParsedTxn{}
	for i := 0; i < len(txns.TxResponses); i++ {
		txn_response := txns.TxResponses[i]
		txn := txns.Txs[i]
		parsedTxn := txn_types.ParsedTxn{
			Code:      txn_response.Code,
			GasUsed:   txn_response.GasUsed,
			GasWanted: txn_response.GasWanted,
			Height:    txn_response.Height,
			RawLog:    txn_response.RawLog,
			Timestamp: parseTimestamp(txn_response.Timestamp, layout),
			Txhash:    txn_response.Txhash,
			Memo:      txn.Body.Memo,
			Messages:  txn.Body.Messages,
			ChainId:   chainId,
		}
		parsedTxns = append(parsedTxns, parsedTxn)
	}

	sort.Sort(ByTimestamp(parsedTxns))

	return parsedTxns, nil

}

func parseTimestamp(timestamp, layout string) time.Time {
	t, err := time.Parse(layout, timestamp)
	if err != nil {
		fmt.Println("Error parsing timestamp:", err)
	}
	return t
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
