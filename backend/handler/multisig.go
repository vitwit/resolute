package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/vitwit/resolute/server/model"
)

func (h *Handler) CreateMultisigAccount(c echo.Context) error {

	account := &model.CreateAccount{}
	if err := c.Bind(account); err != nil {
		return err
	}

	if err := account.Validate(); err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	_, err := h.DB.Exec(`INSERT INTO "multisig_accounts"("address","name","pubkey_type","threshold","chain_id") VALUES ($1,$2,$3,$4,$5)`,
		account.Address, account.Name, account.Pubkeys[0].Pubkey.TypeUrl, account.Threshold, account.ChainId,
	)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	for _, pubkey := range account.Pubkeys {
		_, err = h.DB.Exec(`INSERT INTO "pubkeys"("multisig_address","pubkey","address") VALUES ($1,$2,$3)`,
			account.Address, pubkey.Pubkey.Value, pubkey.Address,
		)
		if err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}
	}

	return c.JSON(http.StatusCreated, model.UserResponse{
		Status:  "success",
		Message: "account created",
	})
}

type AccountsResponse struct {
	Accounts          []model.MultisigAccount `json:"accounts"`
	Total             int                     `json:"total"`
	TransactionsCount map[string]int          `json:"transactions_count"`
}

type TxCount struct {
	Address string `json:"address"`
	Count   int    `json:"count"`
}

func (h *Handler) GetMultisigAccounts(c echo.Context) error {

	address := c.Param("address")

	page, limit, countTotal, err := ParsePaginationParams(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	rows, err := h.DB.Query(`SELECT ma.name,ma.address,ma.pubkey_type,ma.threshold FROM pubkeys as pk INNER JOIN multisig_accounts as ma ON pk.multisig_address=ma.address WHERE pk.address=$1 LIMIT $2 OFFSET $3`, address, limit, (page-1)*limit)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	var accounts []model.MultisigAccount
	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var account model.MultisigAccount
		if err := rows.Scan(&account.Name, &account.Address, &account.PubkeyType,
			&account.Threshold); err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}
		accounts = append(accounts, account)
	}
	rows.Close()

	var count int
	if countTotal {
		rows, err := h.DB.Query(`SELECT count(*) from multisig_accounts`)
		if err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}

		for rows.Next() {
			if err := rows.Scan(&count); err != nil {
				return c.JSON(http.StatusBadRequest, model.UserResponse{
					Status:  "error",
					Message: err.Error(),
				})
			}
		}
		rows.Close()
	}

	txCounts := make(map[string]int)
	for _, ac := range accounts {
		rows, err := h.DB.Query(`SELECT count(*) from transactions where multisig_address=$1 and status=$2`, ac.Address, model.Pending)
		if err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}

		for rows.Next() {
			if err := rows.Scan(&count); err != nil {
				return c.JSON(http.StatusBadRequest, model.UserResponse{
					Status:  "error",
					Message: err.Error(),
				})
			}
			txCounts[ac.Address] = count
		}
		rows.Close()
	}

	return c.JSON(http.StatusOK, AccountsResponse{
		Accounts:          accounts,
		Total:             count,
		TransactionsCount: txCounts,
	})
}

type MultisigAccountResponse struct {
	Account model.MultisigAccount `json:"account"`
	Pubkeys []model.Pubkeys       `json:"pubkeys"`
}

func (h *Handler) GetMultisigAccount(c echo.Context) error {
	address := c.Param("address")

	row := h.DB.QueryRow(`SELECT * FROM multisig_accounts WHERE address=$1`, address)
	fmt.Println(row)
	if row.Err() != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: row.Err().Error(),
		})
	}

	var account model.MultisigAccount
	if err := row.Scan(&account.Name, &account.Address, &account.PubkeyType,
		&account.Threshold); err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	rows, err := h.DB.Query(`SELECT * FROM pubkeys WHERE multisig_address=$1`, address)
	if err != nil {
		return c.JSON(http.StatusBadRequest, model.UserResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	defer rows.Close()

	var pubkeys []model.Pubkeys
	for rows.Next() {
		var pubkey model.Pubkeys
		if err := rows.Scan(&pubkey.MultisigAddress, &pubkey.Pubkey, &pubkey.Address); err != nil {
			return c.JSON(http.StatusBadRequest, model.UserResponse{
				Status:  "error",
				Message: err.Error(),
			})
		}

		pubkeys = append(pubkeys, pubkey)
	}

	return c.JSON(http.StatusOK, MultisigAccountResponse{
		Account: account,
		Pubkeys: pubkeys,
	})

}

func ParsePaginationParams(c echo.Context) (int, int, bool, error) {
	p := c.QueryParam("page")
	l := c.QueryParam("limit")
	ct := c.QueryParam("count_total")

	page := 1
	var err error
	if p != "" {
		page, err = strconv.Atoi(p)
		if err != nil {
			return 0, 0, false, err
		}
	}

	limit := 10
	if l != "" {
		limit, err = strconv.Atoi(l)
		if err != nil {
			return 0, 0, false, err
		}
	}

	countTotal := false
	if ct != "" {
		countTotal, err = strconv.ParseBool(ct)
		if err != nil {
			return 0, 0, false, err
		}
	}

	return page, limit, countTotal, nil
}
