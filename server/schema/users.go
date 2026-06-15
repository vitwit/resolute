package schema

import (
	"encoding/json"
	"time"
)

type Users struct {
	ID        uint64          `pg:"id,pk" json:"id"`
	Address   string          `pg:"address" json:"address"`
	Signature string          `pg:"signature" json:"signature"`
	Salt      int             `pg:"salt" json:"salt"`
	PubKey    json.RawMessage `pg:"pub_key" json:"pubKey"`
	CreatedAt *time.Time      `pg:"created_at" json:"createdAt"`
}
