package config

import (
	"errors"
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	DB                 DBConfig         `mapstructure:"database"`
	API                APIConfig        `mapstructure:"api"`
	COINGECKO          CoingeckoConfig  `mapstructure:"coingecko"`
	NUMIA_BEARER_TOKEN NumiaBearerToken `mapstructure:"numiaBearerToken"`
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
		}

	default:
		return cfg, errors.New("active can be either dev or production")
	}

	return cfg, nil
}
