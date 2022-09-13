package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
)

func (h *Handler) CreateTransaction(c echo.Context) error {
	address := c.Param("address")

	req := &model.CreateTransactionRequest{}
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	if err := req.Validate(); err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	row := h.DB.QueryRow(`SELECT * FROM multisig_accounts WHERE "address"=$1`, address)
	var addr model.MultisigAccount
	fmt.Println(row.Scan(addr))

	feebz, err := json.Marshal(req.Fee)
	if err != nil {
		return err
	}

	var id int
	err = h.DB.QueryRow(`INSERT INTO "transactions"("multisig_address","fee","status","created_at") VALUES ($1,$2,$3,$4) RETURNING "id"`,
		address, feebz, model.Pending, time.Now(),
	).Scan(&id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	for _, msg := range req.Messages {

		mbz, err := json.Marshal(msg.Value)
		if err != nil {
			return err
		}
		_, err = h.DB.Exec(`INSERT INTO "messages"("tx_id","type_url","value") VALUES ($1,$2,$3)`,
			id, msg.TypeUrl, mbz,
		)
		if err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}

	}

	return c.JSON(http.StatusOK, model.UserResponse{
		Status:  "success",
		Message: "transactions created",
	})
}

func (h *Handler) GetTransactions(c echo.Context) error {
	address := c.Param("address")
	page, limit, countTotal, err := ParsePaginationParams(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	rows, err := h.DB.Query(`SELECT * FROM transactions WHERE multisig_address=$1 LIMIT $2 OFFSET $3`, address, limit, (page-1)*limit)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	var transactions []model.Transaction
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var transaction model.Transaction
		if err := rows.Scan(&transaction.Id, &transaction.Fee, &transaction.CreatedAt,
			&transaction.ErrorMessage, &transaction.Status, &transaction.TxHash, &transaction.MultisigAccount); err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}
		transactions = append(transactions, transaction)
	}
	rows.Close()

}

// status := model.Pending
// switch c.Param("status") {
// case "PENDING":
// 	status = model.Pending
// case "FAILED":
// 	status = model.Failed
// case "SUCCESS":
// 	status = model.Success
// default:
// 	status = model.Pending
// }
