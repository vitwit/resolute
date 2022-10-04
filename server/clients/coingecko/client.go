package coingecko

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type Client struct {
	API          string
	VsCurrencies string
}

// NewClient creates a new coingecko client
func NewClient(api string, vsCurrencies []string) Client {
	currencyList := strings.Join(vsCurrencies, ",")
	return Client{api, currencyList}
}

func (c Client) GetPrice(ids []string) (map[string]interface{}, error) {
	resp, err := http.Get(fmt.Sprintf("%s/simple/price?ids=%s&vs_currencies=%s", c.API, strings.Join(ids, ","), c.VsCurrencies))
	if err != nil {
		return nil, err
	}

	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	//Convert the body to type string
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return result, nil
}
