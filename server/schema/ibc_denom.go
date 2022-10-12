package schema

type IBCDenom struct {
	IbcDenom     string `json:"ibc_denom`
	BaseDenom    string `json:"base_denom"`
	CoinDecimals int    `json:"coin_decimals"`
}
