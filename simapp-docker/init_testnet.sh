#!/bin/bash

# Create keys
simd keys add validator-key --keyring-backend test

simd keys add key2 --keyring-backend test

simd keys add key3 --keyring-backend test

echo "crawl ship salon plunge company paper desert margin wet either relief useless chapter client clinic stick like chuckle cash deposit fragile wedding chef canvas" | simd keys add key1 --keyring-backend test --recover 


# Initialize the testnet
simd init --chain-id testnet myvalidator

# Add genesis accounts and tokens
simd genesis add-genesis-account validator-key 1000000000stake --keyring-backend test
simd genesis add-genesis-account key1 1000000000stake --keyring-backend test
simd genesis add-genesis-account key2 1000000000stake --keyring-backend test
simd genesis add-genesis-account key3 1000000000stake --keyring-backend test

# Create gentx
simd genesis gentx validator-key 1000000000stake --chain-id testnet --keyring-backend test

# Collect gentxs
simd genesis collect-gentxs

# To change few configurations in config.toml and app.toml
cd .simapp

cd config

sed -i 's/cors_allowed_origins = \[\]/cors_allowed_origins = \["\*"\]/' config.toml

sed -i 's/enabled-unsafe-cors = false/enabled-unsafe-cors = true/' app.toml

sed -i 's/enable = false/enable = true/1' app.toml

sed -i 's|"tcp://127.0.0.1:26657"|"tcp://127.0.0.0:26657"|' config.toml

# Start the node
simd start

