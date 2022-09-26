package model

import (
	"errors"
)

type STATUS string

const (
	Pending STATUS = "PENDING"
	Success        = "SUCCESS"
	Failed         = "FAILED"
)

type Fees struct {
	Amount []Fee  `json:"amount"`
	Gas    string `json:"gas"`
}

func (f Fees) Validate() error {
	if len(f.Amount) == 0 {
		return errors.New("amount cannot be empty")
	}
	for _, fee := range f.Amount {
		if err := fee.Validate(); err != nil {
			return err
		}
	}

	return nil
}

type Fee struct {
	Denom  string `json:"denom"`
	Amount string `json:"amount"`
}

func (f Fee) Validate() error {
	if len(f.Denom) == 0 {
		return errors.New("denom cannot be empty")
	}

	if len(f.Amount) == 0 {
		return errors.New("amount cannot be empty")
	}

	return nil
}

type Message struct {
	TypeUrl string                 `json:"typeUrl"`
	Value   map[string]interface{} `json:"value"`
}

type CreateTransactionRequest struct {
	Fee      Fees      `json:"fee"`
	Messages []Message `json:"messages"`
	ChainId  string    `json:"chain_id"`
	Memo     string    `json:"memo"`
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
