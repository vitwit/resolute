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
	err = h.DB.QueryRow(`INSERT INTO "transactions"("multisig_address","fee","status","last_updated","messages","memo", "title", "created_at") 
	VALUES
	 ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING "id"`,
		address, feebz, model.Pending, time.Now(), msgsbz, req.Memo, req.Title, time.Now(),
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

	//count of transaction status

	var rows1 *sql.Rows
	rows1, err = h.DB.Query(`SELECT CASE WHEN t.status = 'FAILED' THEN 'failed' WHEN t.status = 'SUCCESS' THEN 'completed' WHEN jsonb_array_length(t.signatures) >= a.threshold THEN 'to-broadcast' ELSE 'to-sign' END AS computed_status, COUNT(*) AS count FROM transactions t JOIN multisig_accounts a ON t.multisig_address = a.address WHERE t.multisig_address = $1 GROUP BY computed_status`, address)

	if err != nil {
		if rows1 != nil && sql.ErrNoRows == rows1.Err() {
			return c.JSON(http.StatusBadRequest, model.ErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("no transactions with address %s", address),
				Log:     rows1.Err().Error(),
			})
		}

		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to query transaction",
			Log:     err.Error(),
		})
	}
	defer rows1.Close()

	txCount := make([]schema.TransactionCount, 0)
	for rows1.Next() {
		var txC schema.TransactionCount
		if err := rows1.Scan(
			&txC.ComputedStatus,
			&txC.Count,
		); err != nil {
			return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode transaction",
				Log:     err.Error(),
			})
		}
		txCount = append(txCount, txC)
	}

	//ends here

	status := utils.GetStatus(c.QueryParam("status"))
	var rows *sql.Rows
	if status == model.Pending {
		rows, err = h.DB.Query(`SELECT t.id,COALESCE(t.signed_at, '0001-01-01 00:00:00'::timestamp) AS signed_at,t.multisig_address,t.status,t.created_at,t.last_updated,t.memo,t.signatures,t.messages,t.hash,t.err_msg,t.fee, m.threshold, 
		json_agg(jsonb_build_object('pubkey', p.pubkey, 'address', p.address, 'multisig_address',p.multisig_address)) AS pubkeys FROM transactions t JOIN multisig_accounts m ON t.multisig_address = m.address JOIN pubkeys p ON t.multisig_address = p.multisig_address WHERE t.multisig_address=$1 and t.status='PENDING' GROUP BY t.id, t.multisig_address, m.threshold, t.messages LIMIT $2 OFFSET $3`,
			address, limit, (page-1)*limit)
	} else {
		rows, err = h.DB.Query(`SELECT t.id,COALESCE(t.signed_at, '0001-01-01 00:00:00'::timestamp) AS signed_at,t.multisig_address,t.status,t.created_at,t.last_updated,t.memo,t.signatures,t.messages,t.hash,t.err_msg,t.fee, m.threshold, 
		json_agg(jsonb_build_object('pubkey', p.pubkey, 'address', p.address, 'multisig_address',p.multisig_address)) AS pubkeys FROM transactions t JOIN multisig_accounts m ON t.multisig_address = m.address JOIN pubkeys p ON t.multisig_address = p.multisig_address WHERE t.multisig_address=$1 and t.status <> 'PENDING' GROUP BY t.id, t.multisig_address, m.threshold, t.messages LIMIT $2 OFFSET $3`,
			address, limit, (page-1)*limit)
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
	defer rows.Close()

	transactions := make([]schema.AllTransactionResult, 0)
	for rows.Next() {
		var transaction schema.AllTransactionResult
		var signedAt time.Time

		if err := rows.Scan(
			&transaction.ID,
			&signedAt,
			&transaction.MultisigAddress,
			&transaction.Status,
			&transaction.CreatedAt,
			&transaction.LastUpdated,
			&transaction.Memo,
			&transaction.Signatures,
			&transaction.Messages,
			&transaction.Hash,
			&transaction.ErrMsg,
			&transaction.Fee,
			&transaction.Threshold,
			&transaction.Pubkeys,
		); err != nil {
			return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode transaction",
				Log:     err.Error(),
			})
		}

		if signedAt.IsZero() {
			transaction.SignedAt = time.Time{} // Set it to zero time if not set
		} else {
			transaction.SignedAt = signedAt // Otherwise, set the actual signed time
		}

		transactions = append(transactions, transaction)
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Data:   transactions,
		Status: "success",
		Count:  txCount,
	})
}

func (h *Handler) GetAllMultisigTxns(c echo.Context) error {
	address := c.Param("address")

	status := utils.GetStatus(c.QueryParam("status"))
	page, limit, _, err := utils.ParsePaginationParams(c)

	multisigRows, err := h.DB.Query(`SELECT p.multisig_address
	FROM pubkeys p
	JOIN multisig_accounts m ON p.multisig_address = m.address
	WHERE p.address = $1`, address)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to query multisig accounts",
			Log:     err.Error(),
		})
	}

	transactions := make([]schema.AllTransactionResult, 0)

	for multisigRows.Next() {
		var multisigAddress string
		if err := multisigRows.Scan(&multisigAddress); err != nil {
			return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Status:  "error",
				Message: "failed to decode multisig account",
				Log:     err.Error(),
			})
		}

		var rows *sql.Rows
		if status == "PENDING" {
			rows, err = h.DB.Query(`SELECT t.id, COALESCE(t.signed_at, '0001-01-01 00:00:00'::timestamp) AS signed_at, t.multisig_address,t.status,t.created_at,t.last_updated,t.memo,t.signatures,t.messages,t.hash,t.err_msg,t.fee, m.threshold, 
		json_agg(jsonb_build_object('pubkey', p.pubkey, 'address', p.address, 'multisig_address',p.multisig_address)) AS pubkeys FROM transactions t JOIN multisig_accounts m ON t.multisig_address = m.address JOIN pubkeys p ON t.multisig_address = p.multisig_address WHERE t.multisig_address=$1 and t.status='PENDING' GROUP BY t.id, t.multisig_address, m.threshold, t.messages LIMIT $2 OFFSET $3`,
				multisigAddress, limit, (page-1)*limit)
		} else {
			rows, err = h.DB.Query(`SELECT t.id, COALESCE(t.signed_at, '0001-01-01 00:00:00'::timestamp) AS signed_at, t.multisig_address,t.status,t.created_at,t.last_updated,t.memo,t.signatures,t.messages,t.hash,t.err_msg,t.fee, m.threshold, 
		json_agg(jsonb_build_object('pubkey', p.pubkey, 'address', p.address, 'multisig_address',p.multisig_address)) AS pubkeys FROM transactions t JOIN multisig_accounts m ON t.multisig_address = m.address JOIN pubkeys p ON t.multisig_address = p.multisig_address WHERE t.multisig_address=$1 and t.status <> 'PENDING' GROUP BY t.id, t.multisig_address, m.threshold, t.messages LIMIT $2 OFFSET $3`,
				multisigAddress, limit, (page-1)*limit)
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

		for rows.Next() {
			var transaction schema.AllTransactionResult
			var signedAt time.Time

			if err := rows.Scan(
				&transaction.ID,
				&signedAt,
				&transaction.MultisigAddress,
				&transaction.Status,
				&transaction.CreatedAt,
				&transaction.LastUpdated,
				&transaction.Memo,
				&transaction.Signatures,
				&transaction.Messages,
				&transaction.Hash,
				&transaction.ErrMsg,
				&transaction.Fee,
				&transaction.Threshold,
				&transaction.Pubkeys,
			); err != nil {
				return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
					Status:  "error",
					Message: "failed to decode transaction",
					Log:     err.Error(),
				})
			}
			if signedAt.IsZero() {
				transaction.SignedAt = time.Time{}
			} else {
				transaction.SignedAt = signedAt
			}
			transactions = append(transactions, transaction)
		}
		rows.Close()
	}
	defer multisigRows.Close()

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

	_, err = h.DB.Exec("UPDATE transactions SET signatures=$1, signed_at=$2 WHERE id=$3", bz, time.Now().UTC(), id)
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
			Message: "invalid transaction id",
		})
	}

	// Fetch signed_at before attempting to delete, to avoid issues if the transaction does not exist
	var signedAt time.Time
	var status string
	var transaction schema.Transaction
	err = h.DB.QueryRow(`SELECT signed_at,status, signatures FROM transactions WHERE id=$1 AND multisig_address=$2`, txId, address).Scan(&signedAt, &status, &transaction.Signatures)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, model.ErrorResponse{
				Status:  "error",
				Message: "transaction not found",
			})
		}
	}

	// Delete the transaction
	_, err = h.DB.Exec(`DELETE FROM transactions WHERE id=$1 AND multisig_address=$2`, txId, address)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Status:  "error",
			Message: "failed to delete transaction",
			Log:     err.Error(),
		})
	}

	// Clear signatures for transactions with signed_at > txSignedAt
	if !signedAt.IsZero() && status == "PENDING" && len(transaction.Signatures) > 0 {
		_, err = h.DB.Exec(`UPDATE transactions SET signatures='[]'::jsonb, signed_at = '0001-01-01 00:00:00' WHERE multisig_address=$1 AND signed_at > $2 and status='PENDING'`, address, signedAt)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, model.ErrorResponse{
				Status:  "error",
				Message: "failed to update transaction signatures",
				Log:     err.Error(),
			})
		}
	}

	return c.JSON(http.StatusOK, model.SuccessResponse{
		Status: "transaction deleted",
	})
}
