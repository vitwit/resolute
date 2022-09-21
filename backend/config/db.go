package config

import (
	"errors"
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	DB DBConfig `mapstructure:"database"`
}

type DBConfig struct {
	Host         string `yaml:"host"`
	Port         string `yaml:"port"`
	User         string `yaml:"user"`
	Password     string `yaml:"password"`
	DatabaseName string `yaml:"name"`
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
		cfg.DB = DBConfig{
			Host:         viper.GetString("production.database.host"),
			Port:         viper.GetString("production.database.port"),
			User:         viper.GetString("production.database.user"),
			Password:     viper.GetString("production.database.password"),
			DatabaseName: viper.GetString("production.database.name"),
		}

	case "dev":
		cfg.DB = DBConfig{
			Host:         viper.GetString("dev.database.host"),
			Port:         viper.GetString("dev.database.port"),
			User:         viper.GetString("dev.database.user"),
			Password:     viper.GetString("dev.database.password"),
			DatabaseName: viper.GetString("dev.database.name"),
		}

	default:
		return cfg, errors.New("active can be either dev or production")
	}

	return cfg, nil
}
