package cron

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ChainNames struct {
	Name string `json:"name"`
}

type AssetList struct {
	Assets []AssetListItem `json:"assets"`
}

type AssetListItem struct {
	Base        string `json:"base"`
	CoinGeckoID string `json:"coingecko_id"`
}

func GetChainNames() ([]ChainNames, error) {
	client := http.DefaultClient

	req, err := http.NewRequest("GET", "https://registry.ping.pub/", nil)
	if err != nil {
		fmt.Println("Errora:", err)
		return nil, err
	}
	req.Header.Set("User-Agent", "Chrome/79")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Errorb:", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Errorc:", err)
		return nil, err
	}

	var chains []ChainNames
	err = json.Unmarshal(body, &chains)
	if err != nil {
		fmt.Println("Errord:", err)
		return nil, err
	}

	return chains, nil

}

func GetCoinGeckoIdMap(chains []ChainNames) map[string]string {

	baseToCoinGeckoID := make(map[string]string)

	for _, chain := range chains {
		chainName := chain.Name
		assetListURL := fmt.Sprintf("https://registry.ping.pub/%s/assetlist.json", chainName)
		req, err := http.NewRequest("GET", assetListURL, nil)
		if err != nil {
			fmt.Println("Errore:", err)
			continue
		}
		req.Header.Set("User-Agent", "Chrome/79")
		client := http.DefaultClient
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Errorf:", err)
			continue
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Errorg:", err)
			continue
		}

		var assetList AssetList
		err = json.Unmarshal(body, &assetList)
		if err != nil {
			fmt.Println("Errorh:", err)
			continue
		}

		for _, asset := range assetList.Assets {
			if asset.CoinGeckoID == "" {
				continue
			}
			base := asset.Base
			coinGeckoID := asset.CoinGeckoID
			baseToCoinGeckoID[base] = coinGeckoID
		}
	}

	// for key, val := range baseToCoinGeckoID {
	// 	fmt.Printf("key=%s, val=%s\n", key, val)
	// }
	return baseToCoinGeckoID
}
