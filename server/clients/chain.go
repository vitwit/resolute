package clients

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func GetStatus(url string) (bool, error) {
	urlString := fmt.Sprintf("%s/cosmos/auth/v1beta1/params", url)

	// Create a new request to the new URL
	req, err := http.NewRequest("GET", urlString, nil)
	if err != nil {
		return false, err

	}

	// Copy the Authorization header from the original request
	req.Header.Set("Authorization", "Bearer token")

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

	fmt.Println("result ============= ", result, resp.StatusCode)

	return false, nil
}
