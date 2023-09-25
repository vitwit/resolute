passage init --chain-id testnet myvalidator
passage add-genesis-account validator 1000000000upasg --keyring-backend test
passage add-genesis-account account1 1000000000upasg --keyring-backend test
passage add-genesis-account account2 1000000000upasg --keyring-backend test
passage gentx validator 1000000000upasg --chain-id testnet
passage collect-gentxs