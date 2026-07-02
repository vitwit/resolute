package clients

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/vitwit/resolute/server/config"
)

func GetStatus(url string, chainId string) (bool, error) {
	config, err := config.ParseConfig()
	if err != nil {
		log.Fatal(err)
	}

	chanDetails := GetChain(chainId)

	if chanDetails == nil {
		return false, errors.New("unable to get chain details")
	}

	urlString := fmt.Sprintf("%s/cosmos/auth/v1beta1/params", url)

	// Create a new request to the new URL
	req, err := http.NewRequest("GET", urlString, nil)
	if err != nil {
		return false, err
	}

	if chanDetails.SourceEnd == "mintscan" {
		authorizationToken := fmt.Sprintf("Bearer %s", config.MINTSCAN_TOKEN.Token)
		req.Header.Add("Authorization", authorizationToken)
	}

	if chanDetails.SourceEnd == "numia" {
		bearerToken := config.NUMIA_BEARER_TOKEN.Token
		var authorization = "Bearer " + bearerToken

		req.Header.Add("Authorization", authorization)
	}

	// Perform the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	// Copy the response to the original response writer
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {

		return false, err
	}

	var result map[string]interface{}
	//Convert the body to type string
	if err := json.Unmarshal(body, &result); err != nil {
		return true, err
	}

	if resp.StatusCode == 200 {
		return true, nil
	}

	return false, nil
}
