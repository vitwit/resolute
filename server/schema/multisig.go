package schema

import (
	"time"
)

type MultisigAccount struct {
	tableName struct{} `pg:"multisig_accounts,alias:t,discard_unknown_columns"`

	ID         string     `pg:"address,pk"`
	Threshold  int        `pg:"threshold"`
	ChainID    string     `pg:"chain_id,use_zero"`
	PubkeyType string     `pg:"pubkey_type,use_zero"`
	CreatedAt  *time.Time `pg:"created_at"`
	Name       string     `pg:"name,use_zero"`
}

type Pubkey struct {
	tableName struct{} `pg:"pubkeys,alias:t,discard_unknown_columns"`

	Address         string                 `pg:"address,pk"`
	MultisigAddress string                 `pg:"multisig_address,pk"`
	Pubkey          map[string]interface{} `pg:"pubkey,use_zero"`

	MultisigAddressRel *MultisigAccount `pg:"fk:multisig_address,rel:has-one"`
}
