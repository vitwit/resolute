package utils

import (
	"errors"
	"fmt"
	"net/url"

	"github.com/vitwit/resolute/server/config"
)

// type ChainConfig struct {
// 	ChainId  string   `json:"chainId"`
// 	RestURIs []string `json:"restURIs"`
// }

func GetChainAPIs(chainId string) (*config.ChainConfig, error) {

	data := config.GetChainAPIs()
	// wd, _ := os.Getwd()
	// filePath := filepath.Join(wd, "/", "networks.json")
	// jsonData, err := os.ReadFile(filePath)
	// if err != nil {
	// 	fmt.Println("Error reading JSON file:", err)
	// 	return nil, err
	// }

	// var data []ChainConfig

	// err = json.Unmarshal([]byte(jsonData), &data)
	// if err != nil {
	// 	fmt.Println("Error unmarshaling JSON data:", err)
	// 	return nil, err
	// }

	var result *config.ChainConfig
	for _, config := range data {
		if config.ChainId == chainId {
			result = config
			break
		}
	}

	fmt.Println("result============================", result.SourceEnd, result.ChainId)

	if result == nil {
		return nil, errors.New("chain id not found")
	}

	return result, nil
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

func CreateAllTxnsRequestURI(api string, address string, limit string, offset string) string {
	return fmt.Sprintf("%s/cosmos/tx/v1beta1/txs?events=message.sender='%s'&order_by=2&pagination.limit=%s&pagination.offset=%s", api, url.QueryEscape(address), url.QueryEscape(limit), url.QueryEscape(offset))
}

func CreateTxnRequestURI(api string, txhash string) string {
	return fmt.Sprintf("%s/cosmos/tx/v1beta1/txs/%s", api, txhash)
}
