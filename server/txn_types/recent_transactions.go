package txn_types

type TxResponse struct {
	Code      int           `json:"code"`
	Codespace string        `json:"codespace"`
	Data      string        `json:"data"`
	Events    []interface{} `json:"events"`
	GasUsed   string        `json:"gas_used"`
	GasWanted string        `json:"gas_wanted"`
	Height    string        `json:"height"`
	Info      string        `json:"info"`
	Logs      []interface{} `json:"logs"`
	RawLog    string        `json:"raw_log"`
	Timestamp string        `json:"timestamp"`
	Tx        interface{}   `json:"tx"`
	Txhash    string        `json:"txhash"`
}

type AuthInfo struct {
	Fee struct {
		Amount []struct {
			Amount string `json:"amount"`
			Denom  string `json:"denom"`
		} `json:"amount"`
		GasLimit string `json:"gas_limit"`
		Granter  string `json:"granter"`
		Payer    string `json:"payer"`
	} `json:"fee"`
	SignerInfos []struct {
		ModeInfo struct {
			Single struct {
				Mode string `json:"mode"`
			} `json:"single"`
		} `json:"mode_info"`
		PublicKey struct {
			Type string `json:"@type"`
			Key  string `json:"key"`
		} `json:"public_key"`
		Sequence string `json:"sequence"`
	} `json:"signer_infos"`
	Tip interface{} `json:"tip"`
}

type Body struct {
	ExtensionOptions            []interface{} `json:"extension_options"`
	Memo                        string        `json:"memo"`
	Messages                    []interface{} `json:"messages"`
	NonCriticalExtensionOptions []interface{} `json:"non_critical_extension_options"`
	TimeoutHeight               string        `json:"timeout_height"`
}

type Tx struct {
	AuthInfo   AuthInfo `json:"auth_info"`
	Body       Body     `json:"body"`
	Signatures []string `json:"signatures"`
}

type TransactionResponses struct {
	Pagination  interface{}  `json:"pagination"`
	Total       string       `json:"total"`
	TxResponses []TxResponse `json:"tx_responses"`
	Txs         []Tx         `json:"txs"`
}

type ParsedTxn struct {
	Code      int           `json:"code"`
	GasUsed   string        `json:"gas_used"`
	GasWanted string        `json:"gas_wanted"`
	Height    string        `json:"height"`
	RawLog    string        `json:"raw_log"`
	Timestamp string        `json:"timestamp"`
	Txhash    string        `json:"txhash"`
	Memo      string        `json:"memo"`
	Messages  []interface{} `json:"messages"`
	ChainId   string        `json:"chain_id"`
}
