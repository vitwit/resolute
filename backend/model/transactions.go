package model

import (
	"errors"
	"time"
)

type STATUS string

const (
	Pending STATUS = "PENDING"
	Success        = "SUCCESS"
	Failed         = "FAILED"
)

type Transaction struct {
	Id              int       `json:"id"`
	MultisigAccount string    `json:"multisig_account"`
	Fee             Fees      `json:"fee"`
	Status          STATUS    `json:"status"`
	CreatedAt       time.Time `json:"created_at"`
	TxHash          string    `json:"tx_hash"`
	ErrorMessage    string    `json:"error_message"`
}

type Fees struct {
	Amount []Fee `json:"amount"`
	Gas    int   `json:"gas"`
}

func (f Fees) Validate() error {
	if len(f.Amount) == 0 {
		return errors.New("amount cannot be empty")
	}
	for _, fee := range f.Amount {
		if len(fee.Denom) == 0 {
			return errors.New("denom cannot be empty")
		}

		if len(fee.Amount) == 0 {
			return errors.New("amount cannot be empty")
		}
	}

	return nil
}

type Fee struct {
	Denom  string `json:"denom"`
	Amount string `json:"amount"`
}

type Message struct {
	TypeUrl string                 `json:"type_url"`
	Value   map[string]interface{} `json:"value"`
}

type CreateTransactionRequest struct {
	Fee      Fees      `json:"fee"`
	Messages []Message `json:"messages"`
	ChainId  string    `json:"chain_id"`
}

func (m CreateTransactionRequest) Validate() error {
	if err := m.Fee.Validate(); err != nil {
		return err
	}

	if len(m.Messages) == 0 {
		return errors.New("atleast one messages is required")
	}

	if len(m.ChainId) == 0 {
		return errors.New("chain-id cannot be empty")
	}
	return nil
}
