package clients

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
	"github.com/vitwit/resolute/server/config"
)

// RedisClient is the Redis client instance
var RedisClient *redis.Client
var ctx = context.Background()

// InitializeRedis initializes the Redis client
func InitializeRedis(addr string, password string, db int) {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})

	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
}

// SetValue sets a value in Redis
func SetValue(key string, value string) error {
	err := RedisClient.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}
	return nil
}

// GetValue gets a value from Redis
func GetValue(key string) (string, error) {
	val, err := RedisClient.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", nil
	} else if err != nil {
		return "", err
	}
	return val, nil
}

func GetChain(chainId string) *config.ChainConfig {
	var chains []config.ChainConfig
	data, _ := GetValue("chains")

	e := json.Unmarshal([]byte(data), &chains)
	if e != nil {
		fmt.Println("e1111111111111", e.Error())
	}

	var chain *config.ChainConfig

	for _, c := range chains {
		fmt.Println("dddddddddddddddddddddd", c.ChainId, chainId)
		if c.ChainId == chainId {
			fmt.Println("cccccccccccccccccccccccccccccccc", c)
			chain = &c
			break
		}
	}

	return chain
}
