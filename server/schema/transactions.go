package schema

import (
	"encoding/json"
	"time"
)

type Transaction struct {
	ID              int              `pg:"id,pk" json:"id"`
	MultisigAddress string           `pg:"multisig_address,use_zero" json:"multisig_address"`
	Fee             *json.RawMessage `pg:"fee" json:"fee" sql:"-"`
	Status          string           `pg:"status,use_zero" json:"status"`
	Messages        json.RawMessage  `pg:"messages" json:"messages"`
	Hash            *string          `pg:"hash" json:"hash"`
	ErrMsg          *string          `pg:"err_msg" json:"err_msg"`
	Memo            *string          `pg:"memo" json:"memo"`
	Signatures      json.RawMessage  `pg:"signatures" json:"signatures"`
	LastUpdated     time.Time        `pg:"last_updated,use_zero" json:"last_updated"`
	CreatedAt       time.Time        `pg:"created_at,use_zero" json:"created_at"`
}

type TransactionCount struct {
	ComputedStatus string `pg:"computed_status" json:"computed_status"`
	Count          int    `pg:"count" json:"count"`
}

type AllTransactionResult struct {
	ID              int              `pg:"id,pk" json:"id"`
	MultisigAddress string           `pg:"multisig_address,use_zero" json:"multisig_address"`
	Fee             *json.RawMessage `pg:"fee" json:"fee,omitempty" sql:"-"`
	Status          string           `pg:"status,use_zero" json:"status"`
	Messages        *json.RawMessage `pg:"messages" json:"messages"`
	Hash            *string          `pg:"hash" json:"hash"`
	ErrMsg          *string          `pg:"err_msg" json:"err_msg"`
	Memo            *string          `pg:"memo" json:"memo"`
	Signatures      *json.RawMessage `pg:"signatures" json:"signatures"`
	LastUpdated     time.Time        `pg:"last_updated" sql:"-" json:"last_updated,omitempty"`
	CreatedAt       time.Time        `pg:"created_at" sql:"-" json:"created_at,omitempty"`
	Threshold       int              `pg:"threshold" json:"threshold"`
	Pubkeys         json.RawMessage  `pg:"pubkeys" json:"pubkeys"`
}
