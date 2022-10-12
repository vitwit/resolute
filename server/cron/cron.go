package cron

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/vitwit/resolute/server/clients/coingecko"
	"github.com/vitwit/resolute/server/config"
	"github.com/vitwit/resolute/server/schema"
	"github.com/vitwit/resolute/server/utils"

	"github.com/robfig/cron"
)

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price"

// Cron wraps all required parameters to create cron jobs
type Cron struct {
	cfg config.Config
	db  *sql.DB
}

// NewCron sets necessary config and clients to begin jobs
func NewCron(cfg config.Config, db *sql.DB) *Cron {
	return &Cron{cfg, db}
}

// Start starts to create cron jobs which fetches chosen asset list information and
// store them in database every hour and every 24 hours.
func (c *Cron) Start() error {
	log.Println("Starting cron jobs...")

	cron := cron.New()

	// Every 15 minute
	cron.AddFunc("15 * * * * *", func() {
		c.CoinsPriceInfoList()
		log.Println("successfully saved price information list")
	})

	// Every day sync ibc denoms information
	cron.AddFunc("15 * * * *", func() {
		c.SyncIBCDenoms()
		log.Println("successfully synced IBC denoms")
	})

	go cron.Start()

	return nil
}

var networks = []string{
	"https://resolute.witval.com/cosmos_api/",
	"https://resolute.witval.com/osmosis_api/",
	"https://resolute.witval.com/regen_api/",
	"https://resolute.witval.com/akash_api/",
	"https://resolute.witval.com/juno_api/",
	"https://resolute.witval.com/stargaze_api/",
}

var denomToDecimals = map[string]int{
	"uatom":   6,
	"uregen":  6,
	"uosmo":   6,
	"ujuno":   6,
	"uusdc":   6,
	"ustars":  6,
	"uakt":    6,
	"basecro": 18,
	"ubld":    6,
	"uaxl":    6,
	"aevmos":  18,
	"uumee":   6,
}

func (c *Cron) SyncIBCDenoms() {

	rows, err := c.db.Query(`SELECT ibc_denom FROM public.ibc_denoms`)
	if err != nil {
		if rows != nil && sql.ErrNoRows == rows.Err() {
			utils.InfoLogger.Println("no coin info in database")
		}
	}

	IBCDenomsMap := make(map[string]bool)
	for rows.Next() {
		var ibcDenom schema.IBCDenom
		if err := rows.Scan(
			&ibcDenom.IbcDenom,
		); err != nil {
			utils.ErrorLogger.Printf("failed to fetch ibc denom information %s\n", err.Error())
		}

		IBCDenomsMap[ibcDenom.IbcDenom] = true
	}

	for _, uri := range networks {
		var nextKey string
		for {
			fmt.Println(nextKey)
			supplyRes, err := GetSupply(uri, nextKey)
			if err != nil {
				break
			}

			for _, s := range supplyRes.Supply {
				if strings.HasPrefix(s.Denom, "ibc/") {
					if _, ok := IBCDenomsMap[s.Denom]; !ok {
						denom := strings.Split(s.Denom, "ibc/")[1]
						traceRes, err := GetDenomTrace(uri, denom)
						if err != nil {
							// TODO: log error
						}

						if precision, ok1 := denomToDecimals[traceRes.DenomTrace.BaseDenom]; ok1 {
							if _, err := c.db.Exec(`INSERT INTO "ibc_denoms"("ibc_denom","base_denom","coin_decimals") VALUES ($1,$2,$3)`,
								s.Denom, traceRes.DenomTrace.BaseDenom, precision,
							); err != nil {
								fmt.Println(err)
							}
						}
					}

					// fmt.Println(s.Denom)
					// fmt.Println(traceRes.DenomTrace.BaseDenom)
					fmt.Println("=========================================")
					time.Sleep(time.Second * 1)
				}
			}

			time.Sleep(time.Second * 2)

			fmt.Println(supplyRes.Pagination.NextKey)
			nextKey = supplyRes.Pagination.NextKey
			if nextKey == "" {
				break
			}
		}
	}
}

// CoinsPriceInfoList fetches tokens information list and save its price
func (c *Cron) CoinsPriceInfoList() {
	rows, err := c.db.Query(`SELECT denom,coingecko_name FROM price_info WHERE enabled=$1`, true)
	if err != nil {
		if rows != nil && sql.ErrNoRows == rows.Err() {
			utils.InfoLogger.Println("no coin info in database")
		}
	}

	coinIds := make([]string, 0)
	coinNameToDenom := make(map[string]string, 0)

	for rows.Next() {
		var priceInfo schema.PriceInfo
		if err := rows.Scan(
			&priceInfo.Denom,
			&priceInfo.CoingeckoName,
		); err != nil {
			utils.ErrorLogger.Printf("failed to fetch coin information %s\n", err.Error())
		}

		coinIds = append(coinIds, priceInfo.CoingeckoName)

		coinNameToDenom[priceInfo.CoingeckoName] = priceInfo.Denom
	}

	if len(coinIds) > 0 {
		client1 := coingecko.NewClient(c.cfg.COINGECKO.URI, []string{"usd"})

		priceInfo, err := client1.GetPrice(coinIds)
		if err != nil {
			utils.ErrorLogger.Printf("failed to fetch price information %s\n", err.Error())
		}

		for k, v := range priceInfo {
			val, _ := json.Marshal(v)
			_, err = c.db.Exec("UPDATE price_info SET info=$1,last_updated=$2 WHERE denom=$3", val, time.Now(), coinNameToDenom[k])
			if err != nil {
				utils.ErrorLogger.Printf("failed to update price information for denom = %s : %s\n", k, err.Error())
			}
		}
	}
}

func GetSupply(baseURL string, key string) (*SupplyResponse, error) {
	uri := fmt.Sprintf("%s/cosmos/bank/v1beta1/supply", baseURL)
	if key != "" {
		uri = fmt.Sprintf("%s/cosmos/bank/v1beta1/supply?pagination.key=%s", baseURL, url.QueryEscape(key))
	}

	resp, err := http.Get(uri)
	if err != nil {
		return nil, err
	}

	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result SupplyResponse
	//Convert the body to type string
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

func GetDenomTrace(baseURL string, trace string) (*DenomTraceResponse, error) {
	uri := fmt.Sprintf("%s/ibc/apps/transfer/v1/denom_traces/%s", baseURL, trace)

	resp, err := http.Get(uri)
	if err != nil {
		return nil, err
	}

	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result DenomTraceResponse
	//Convert the body to type string
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

type DenomTraceResponse struct {
	DenomTrace DenomTrace `json:"denom_trace"`
}

type DenomTrace struct {
	Path      string `json:"path"`
	BaseDenom string `json:"base_denom"`
}

type Coin struct {
	Denom  string `json:"denom"`
	Amount string `json:"amount"`
}

type SupplyResponse struct {
	Supply     []Coin       `json:"supply"`
	Pagination PageResponse `json:"pagination"`
}

type PageResponse struct {
	NextKey string `json:"next_key"`
	Total   string `json:"total"`
}
