package models

import "time"

type Transactions struct {
	Address string `json:"address,omitempty" validate:"required"`
	ChainID string `json:"chainId,omitempty" validate:"required"`
	// Gas         	string                 `json:"gas,omitempty" validate:"required"`
	Fee       Fee       `json:"fee,omitempty" validate:"required"`
	Msgs      []Msg     `json:"msgs,omitempty" validate:"required"`
	Status    string    `json:"status,omitempty" validate:"required"`
	Timestamp time.Time `json:"timestamp"`
	Hash      string    `json:"hash,omitempty"`
}

type Value interface{}

type Msg struct {
	TypeUrl string                 `json:"typeUrl,omitempty" bson:"typeUrl" validate:"required"`
	Value   map[string]interface{} `json:"value,omitempty" validate:"required"`
}

type Fee struct {
	Gas    string   `json:"gas,omitempty" validate:"required"`
	Amount []Amount `json:"amount,omitempty" validate:"required"`
}

type Amount struct {
	Amount string `json:"amount,omitempty" validate:"required"`
	Denom  string `json:"denom,omitempty" validate:"required"`
}
