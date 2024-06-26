package config

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type Config struct {
	DB                 DBConfig         `mapstructure:"database"`
	API                APIConfig        `mapstructure:"api"`
	COINGECKO          CoingeckoConfig  `mapstructure:"coingecko"`
	NUMIA_BEARER_TOKEN NumiaBearerToken `mapstructure:"numiaBearerToken"`
	MINTSCAN_TOKEN     MintscanToken    `mapstructure:"mintscanToken"`
	REDIS_URI          string           `mapstructure:"redisUri"`
}

type DBConfig struct {
	Host         string `yaml:"host"`
	Port         string `yaml:"port"`
	User         string `yaml:"user"`
	Password     string `yaml:"password"`
	DatabaseName string `yaml:"name"`
}

type APIConfig struct {
	Port string `yaml:"port"`
}

type CoingeckoConfig struct {
	URI string `yaml:"uri"`
}

type NumiaBearerToken struct {
	Token string `yaml:"token"`
}

type MintscanToken struct {
	Token string `yaml:"token"`
}

func ParseConfig() (Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./")
	viper.AddConfigPath("../")

	cfg := Config{}

	if err := viper.ReadInConfig(); err != nil {
		return cfg, fmt.Errorf("fatal error config file: %s ", err)
	}

	if viper.GetString("active") == "" {
		return cfg, errors.New("define active param in your config file")
	}

	switch viper.GetString("active") {
	case "production":
		{
			cfg.DB = DBConfig{
				Host:         viper.GetString("production.database.host"),
				Port:         viper.GetString("production.database.port"),
				User:         viper.GetString("production.database.user"),
				Password:     viper.GetString("production.database.password"),
				DatabaseName: viper.GetString("production.database.name"),
			}
			cfg.API = APIConfig{
				Port: viper.GetString("production.api.port"),
			}
			cfg.COINGECKO = CoingeckoConfig{
				URI: viper.GetString("production.coingecko.uri"),
			}
			cfg.NUMIA_BEARER_TOKEN = NumiaBearerToken{
				Token: viper.GetString("production.numiaBearerToken"),
			}
			cfg.MINTSCAN_TOKEN = MintscanToken{
				Token: viper.GetString("production.mintscanToken"),
			}
			cfg.REDIS_URI = viper.GetString("production.redisUri")
		}

	case "dev":
		{
			cfg.DB = DBConfig{
				Host:         viper.GetString("dev.database.host"),
				Port:         viper.GetString("dev.database.port"),
				User:         viper.GetString("dev.database.user"),
				Password:     viper.GetString("dev.database.password"),
				DatabaseName: viper.GetString("dev.database.name"),
			}
			cfg.API = APIConfig{
				Port: viper.GetString("production.api.port"),
			}
			cfg.COINGECKO = CoingeckoConfig{
				URI: viper.GetString("production.coingecko.uri"),
			}
			cfg.NUMIA_BEARER_TOKEN = NumiaBearerToken{
				Token: viper.GetString("dev.numiaBearerToken"),
			}
			cfg.MINTSCAN_TOKEN = MintscanToken{
				Token: viper.GetString("production.mintscanToken"),
			}
			cfg.REDIS_URI = viper.GetString("production.redisUri")
		}

	default:
		return cfg, errors.New("active can be either dev or production")
	}

	return cfg, nil
}

type ChainConfig struct {
	ChainId     string   `json:"chainId"`
	RestURIs    []string `json:"restURIs"`
	RestURI     string   `json:"restURI"`
	RpcURI      string   `json:"rpcURI"`
	CheckStatus bool     `json:"checkStatus"`
}

func GetChainAPIs() []*ChainConfig {
	wd, _ := os.Getwd()
	filePath := filepath.Join(wd, "/", "networks.json")
	jsonData, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatalln("Error reading JSON file:", err)
		return nil
	}

	var data []*ChainConfig

	err = json.Unmarshal([]byte(jsonData), &data)
	if err != nil {
		log.Fatalln("Error unmarshaling JSON data:", err)
		return nil
	}

	return data
}
