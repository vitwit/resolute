package schema

import (
	"encoding/json"
	"time"
)

type Transaction struct {
	ID              int             `pg:"id,pk" json:"id"`
	MultisigAddress string          `pg:"multisig_address,use_zero" json:"multisig_address"`
	Fee             json.RawMessage `pg:"fee" json:"fee" sql:"-"`
	Status          string          `pg:"status,use_zero" json:"status"`
	Messages        json.RawMessage `pg:"messages" json:"messages"`
	Hash            *string         `pg:"hash" json:"hash"`
	ErrMsg          *string         `pg:"err_msg" json:"err_msg"`
	Memo            *string         `pg:"memo" json:"memo"`
	Signatures      json.RawMessage `pg:"signatures" json:"signatures"`
	LastUpdated     time.Time       `pg:"last_updated,use_zero" json:"last_updated"`
	CreatedAt       time.Time       `pg:"created_at,use_zero" json:"created_at"`
}
