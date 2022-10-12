package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
	"github.com/vitwit/resolute/server/schema"
	"github.com/vitwit/resolute/server/utils"
)

func (h *Handler) CreateTransaction(c echo.Context) error {
	address := c.Param("address")

	req := &model.CreateTransactionRequest{}
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to decode request",
			Log:     err.Error(),
		})
	}

	if err := req.Validate(); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
			Log:     err.Error(),
		})
	}

	row := h.DB.QueryRow(`SELECT address,threshold,chain_id,pubkey_type,name,created_by,created_at
	 FROM multisig_accounts WHERE "address"=$1`, address)
	var addr schema.MultisigAccount
	if err := row.Scan(&addr.Address, &addr.Threshold, &addr.ChainID, &addr.PubkeyType, &addr.Name,
		&addr.CreatedBy, &addr.CreatedAt); err != nil {
		if sql.ErrNoRows == err {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("invalid multisig account address %s: not found", address),
				Log:     err.Error(),
			})
		}
		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "something went wrong",
			Log:     err.Error(),
		})
	}

	feebz, err := json.Marshal(req.Fee)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to decode fee: invalid fee",
			Log:     err.Error(),
		})
	}

	msgsbz, err := json.Marshal(req.Messages)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to decode messages: invalid messages",
			Log:     err.Error(),
		})
	}

	var id int
	err = h.DB.QueryRow(`INSERT INTO "transactions"("multisig_address","fee","status","last_updated","messages","memo") 
	VALUES
	 ($1,$2,$3,$4,$5,$6) RETURNING "id"`,
		address, feebz, model.Pending, time.Now(), msgsbz, req.Memo,
	).Scan(&id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to store transaction",
			Log:     err.Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status:  "success",
		Message: "transactions created",
	})
}

func (h *Handler) GetTransactions(c echo.Context) error {
	address := c.Param("address")
	page, limit, _, err := utils.ParsePaginationParams(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
			Log:     err.Error(),
		})
	}

	status := utils.GetStatus(c.QueryParam("status"))
	var rows *sql.Rows
	if status == model.Pending {
		rows, err = h.DB.Query(`SELECT id,multisig_address,fee,status,created_at,messages,hash,
		err_msg,last_updated,memo,signatures FROM transactions WHERE multisig_address=$1 AND status=$2 LIMIT $3 OFFSET $4`, address, status, limit, (page-1)*limit)
	} else {
		rows, err = h.DB.Query(`SELECT id,multisig_address,fee,status,created_at,messages,hash,
		err_msg,last_updated,memo,signatures FROM transactions WHERE multisig_address=$1 AND status<>$2 LIMIT $3 OFFSET $4`, address, model.Pending, limit, (page-1)*limit)
	}
	if err != nil {
		if rows != nil && sql.ErrNoRows == rows.Err() {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("no transactions with address %s", address),
				Log:     rows.Err().Error(),
			})
		}

		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to query transaction",
			Log:     err.Error(),
		})
	}

	transactions := make([]schema.Transaction, 0)
	for rows.Next() {
		var transaction schema.Transaction
		if err := rows.Scan(
			&transaction.ID,
			&transaction.MultisigAddress,
			&transaction.Fee,
			&transaction.Status,
			&transaction.CreatedAt,
			&transaction.Messages,
			&transaction.Hash,
			&transaction.ErrMsg,
			&transaction.LastUpdated,
			&transaction.Memo,
			&transaction.Signatures,
		); err != nil {
			return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode transaction",
				Log:     err.Error(),
			})
		}
		transactions = append(transactions, transaction)
	}
	rows.Close()

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Data:   transactions,
		Status: "success",
	})
}

func (h *Handler) GetTransaction(c echo.Context) error {
	id := c.Param("id")
	address := c.Param("address")
	txId, err := strconv.Atoi(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "invalid transaction id ",
			Log:     "",
		})
	}

	row := h.DB.QueryRow(`SELECT id,multisig_address,fee,status,created_at,messages,hash,
	err_msg,last_updated,memo,signatures FROM transactions WHERE id=$1 AND multisig_address=$2`, txId, address)

	var transaction schema.Transaction
	if err := row.Scan(
		&transaction.ID,
		&transaction.MultisigAddress,
		&transaction.Fee,
		&transaction.Status,
		&transaction.CreatedAt,
		&transaction.Messages,
		&transaction.Hash,
		&transaction.ErrMsg,
		&transaction.LastUpdated,
		&transaction.Memo,
		&transaction.Signatures,
	); err != nil {
		if sql.ErrNoRows == row.Err() {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("no transaction with address %s and id=%d", address, txId),
				Log:     row.Err().Error(),
			})
		}

		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to query transaction",
			Log:     row.Err().Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Data:   transaction,
		Status: "success",
	})
}

type Signature struct {
	Address   string `json:"address"`
	Signature string `json:"signature"`
}

type SignTxReq struct {
	Signature string `json:"signature"`
	Signer    string `json:"signer"`
}

func (h *Handler) SignTransaction(c echo.Context) error {
	id := c.Param("id")
	address := c.Param("address")
	txId, err := strconv.Atoi(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "invalid transaction id ",
		})
	}

	req := &SignTxReq{}
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	row := h.DB.QueryRow(`SELECT signatures FROM transactions WHERE id=$1 AND multisig_address=$2`, txId, address)

	var transaction schema.Transaction
	if err := row.Scan(
		&transaction.Signatures,
	); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	var signatures []Signature
	if err := json.Unmarshal(transaction.Signatures, &signatures); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	var result []Signature
	if len(signatures) == 0 {
		result = append(result, Signature{
			Address:   req.Signer,
			Signature: req.Signature,
		})
	} else {
		exists := false
		for _, sig := range signatures {
			if sig.Address == req.Signer {
				exists = true
				result = append(result, Signature{
					Address:   req.Signer,
					Signature: req.Signature,
				})
			} else {

				result = append(result, Signature{
					Address:   sig.Address,
					Signature: sig.Signature,
				})
			}

		}

		if !exists {
			result = append(result, Signature{
				Address:   req.Signer,
				Signature: req.Signature,
			})
		}
	}

	bz, err := json.Marshal(result)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	_, err = h.DB.Exec("UPDATE transactions SET signatures=$1 WHERE id=$2", bz, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "successfully signed",
	})
}

type UpdateTxReq struct {
	Status       string `json:"status"`
	ErrorMessage string `json:"error_message"`
	TxHash       string `json:"hash"`
}

func (h *Handler) UpdateTransactionInfo(c echo.Context) error {
	id := c.Param("id")
	address := c.Param("address")
	txId, err := strconv.Atoi(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "invalid transaction id ",
		})
	}

	req := &UpdateTxReq{}
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	status := utils.GetStatus(req.Status)
	_, err = h.DB.Exec(`UPDATE transactions SET status=$1,hash=$2,err_msg=$3,last_updated=$4 WHERE id=$5 AND multisig_address=$6`,
		status, req.TxHash, req.ErrorMessage, time.Now().UTC(), txId, address,
	)

	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to update transaction",
			Log:     err.Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "transaction updated",
	})
}

func (h *Handler) DeleteTransaction(c echo.Context) error {
	id := c.Param("id")
	address := c.Param("address")
	txId, err := strconv.Atoi(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "invalid transaction id ",
		})
	}

	_, err = h.DB.Exec(`DELETE from transactions WHERE id=$1 AND multisig_address=$2`, txId, address)

	if err != nil {
		return c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Status:  "error",
			Message: "failed to delete transaction",
			Log:     err.Error(),
		})
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "transaction deleted",
	})
}
