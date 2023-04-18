package cron

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/vitwit/resolute/server/clients/coingecko"
	"github.com/vitwit/resolute/server/config"
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

	go cron.Start()

	return nil
}

// CoinsPriceInfoList fetches tokens information list and save its price
func (c *Cron) CoinsPriceInfoList() {

	// fetches the names of chains from https://registry.ping.pub/
	chainnames, err := GetChainNames()
	if err != nil {
		utils.ErrorLogger.Printf("failed to fetch chain names %s\n", err.Error())
	}

	// fetches map(key = base, value = coinGeckoId) from  https://registry.ping.pub/{chain-name}/assetlist.json
	coinGeckoMap := GetCoinGeckoIdMap(chainnames)
	if len(coinGeckoMap) == 0 {
		utils.InfoLogger.Println("no coin info in the fetched map")
	}

	// coinId = coinGeckoId in assetlist.json
	coinIds := make([]string, 0)

	// key = coinGeckoId and value = base in assetlist.json
	coinNameToDenom := make(map[string]string, 0)

	for denom, coinGeckoId := range coinGeckoMap {
		coinIds = append(coinIds, coinGeckoId)
		coinNameToDenom[coinGeckoId] = denom
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

		/*
			// can use this instead of above in case want to have [insert / update] rather than just [update]
				for k, v := range priceInfo {
				    val, _ := json.Marshal(v)
				    	_, err = c.db.Exec(`
				        	INSERT INTO price_info (denom, info, last_updated)
				        	VALUES ($1, $2, $3)
				        	ON CONFLICT (denom) DO UPDATE
				        	SET info = $2, last_updated = $3
				    	`, coinNameToDenom[k], val, time.Now())
				    if err != nil {
				        utils.ErrorLogger.Printf("failed to update price information for denom = %s : %s\n", k, err.Error())
				    }
				}
		*/
	}
}
