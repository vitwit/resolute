package schema

import (
	"encoding/json"
	"time"
)

type PriceInfo struct {
	Denom         string          `json:"denom"`
	CoingeckoName string          `json:"coingecko_name"`
	Enabled       bool            `json:"enabled"`
	LastUpdated   time.Time       `json:"last_updated"`
	Info          json.RawMessage `json:"info"`
}
