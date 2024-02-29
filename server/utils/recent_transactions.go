package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

type ChainConfig struct {
	ChainId  string   `json:"chainId"`
	RestURIs []string `json:"restURIs"`
}

func GetChainAPIs(chainId string) ([]string, error) {
	wd, _ := os.Getwd()
	filePath := filepath.Join(wd, "/", "networks.json")
	jsonData, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return nil, err
	}

	var data []ChainConfig

	err = json.Unmarshal([]byte(jsonData), &data)
	if err != nil {
		fmt.Println("Error unmarshaling JSON data:", err)
		return nil, err
	}

	var result *ChainConfig
	for _, config := range data {
		if config.ChainId == chainId {
			result = &config
			break
		}
	}

	if result == nil {
		return nil, errors.New("chain id not found")
	}

	return result.RestURIs, nil
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
