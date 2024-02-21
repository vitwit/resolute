package utils

import (
	"encoding/json"
	"fmt"
	"os"
)

type ChainConfig struct {
	ChainId string   `json:"chainId"`
	Rest    []string `json:"rest"`
}

func GetChainAPIs(chainId string) []string {
	jsonData, err := os.ReadFile("/home/vitwit/hemanthghs/work/resolute/server/networks.json")
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil
	}

	var data []ChainConfig

	err = json.Unmarshal([]byte(jsonData), &data)
	if err != nil {
		fmt.Println("Error unmarshaling JSON data:", err)
		return nil
	}

	var result *ChainConfig
	for _, config := range data {
		if config.ChainId == chainId {
			result = &config
			break
		}
	}

	return result.Rest
}

func CreateRequestURI(api string, module string, address string) string {
	// senderEvent := fmt.Sprintf(`message.sender="%v"`, address)

	// params := url.Values{}
	// params.Set("events", senderEvent)
	// if module == "all" {
	// 	moduleEvent := fmt.Sprintf(`message.module="%v"`, module)
	// 	params.Set("events", moduleEvent)
	// }
	// return fmt.Sprintf(api + "/cosmos/tx/v1beta1/txs" + params.Encode())
	if module == "all" {
		return api + "/cosmos/tx/v1beta1/txs" + "?events=message.sender=%27" + address + "%27" + "&order_by=2&pagination.limit=5"
	} else {
		return api + "/cosmos/tx/v1beta1/txs" + "?events=message.sender=%27" + address + "%27&events=message.module=%27" + module + "%27" + "&order_by=2&pagination.limit=5"
	}
}
