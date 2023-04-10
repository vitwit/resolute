const fs = require('fs');
const path = require('path');

const chainsFilePath = path.join(__dirname, './src/chains.json');
const chainsData = fs.readFileSync(chainsFilePath, 'utf8');
const chains = JSON.parse(chainsData);

const networks = chains.map(chain => ({
  showAirdrop: chain.showAirdrop,
  logos: chain.logos,
  experimental: chain.experimental,
  isTestnet: chain.isTestnet,
  explorerTxHashEndpoint: chain.explorerTxHashEndpoint,
  config: {
    chainId: chain.config.chainId,
    chainName: chain.config.chainName,
    rest: chain.config.rest,
    rpc: chain.config.rpc,
    stakeCurrency: chain.config.stakeCurrency,
    bip44: chain.config.bip44,
    bech32Config: chain.config.bech32Config,
    currencies: chain.config.currencies,
    feeCurrencies: chain.config.feeCurrencies,
    coinType: chain.config.coinType,
    gasPriceStep: chain.config.gasPriceStep,
    walletUrlForStaking: chain.config.walletUrlForStaking,
  },
  airdropMessage: chain.airdropMessage,
  airdropActions: chain.airdropActions,
  aminoConfig: chain.aminoConfig,
  enableModules: chain.enableModules,
}));

module.exports = {
    networks,
}
