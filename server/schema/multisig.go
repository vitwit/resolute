package schema

import (
	"encoding/json"
	"time"
)

type MultisigAccount struct {
	Address    string     `pg:"address,pk" json:"address"`
	Threshold  int        `pg:"threshold" json:"threshold"`
	ChainID    string     `pg:"chain_id,use_zero" json:"chain_id"`
	PubkeyType string     `pg:"pubkey_type,use_zero" json:"pubkey_type"`
	CreatedAt  *time.Time `pg:"created_at" json:"created_at"`
	CreatedBy  string     `pg:"created_by" json:"created_by"`
	Name       string     `pg:"name,use_zero" json:"name"`
}

type Pubkey struct {
	Address         string          `pg:"address,pk" json:"address"`
	MultisigAddress string          `pg:"multisig_address,pk" json:"multisig_address"`
	Pubkey          json.RawMessage `pg:"pubkey,use_zero" json:"pubkey"`
}
