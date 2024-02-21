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
	fmt.Println(module)
	result := make(map[string]txn_types.TransactionResponses)
	for i := 0; i < len(req.Addresses); i++ {
		fmt.Println(req.Addresses[i])
		res, _ := getNetworkRecentTransactions(req.Addresses[i].ChainId, module, req.Addresses[i].Address)
		fmt.Println("=====")
		fmt.Println(res)
		result[req.Addresses[i].ChainId] = *res
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "done",
		Data:   result,
	})
}

func getNetworkRecentTransactions(chainId string, module string, address string) (*txn_types.TransactionResponses, error) {
	var bearer = "Bearer " + "sk_28d9ca62e0a2415fa93d0ad09f27cc78"
	networkURIs := utils.GetChainAPIs(chainId)
	requestURI := utils.CreateRequestURI(networkURIs[0], module, address)
	fmt.Println("=============")
	fmt.Println(requestURI)
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

func GetSortedTransactions(txns txn_types.TransactionResponses, chainId string) ([]txn_types.ParsedTxn, error) {

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
			Timestamp: txn_response.Timestamp,
			Txhash:    txn_response.Txhash,
			Memo:      txn.Body.Memo,
			Messages:  txn.Body.Messages,
			ChainId:   chainId,
		}
		parsedTxns = append(parsedTxns, parsedTxn)
	}

	sort.Slice(parsedTxns, func(i, j int) bool {
		timeI, errI := time.Parse(time.RFC3339, parsedTxns[i].Timestamp)
		timeJ, errJ := time.Parse(time.RFC3339, parsedTxns[j].Timestamp)

		if errI != nil || errJ != nil {
			return false
		}

		return timeI.Before(timeJ)
	})

	return parsedTxns, nil

}
