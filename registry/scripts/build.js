// gotta resolve typescript file to javascrip files;
const { tejaGetMainNetworks, tejaGetTestNetworks } = require('../utils/networks');

const fs = require('fs');
const deepmerge = require('deepmerge');
const { getSystemErrorMap } = require('util');
const glob = require('glob').sync;
const paths = glob(`../registry/**/*.json`);

console.log("tejaNets", tejaGetMainNetworks)


const resoluteChainsSet = new Set();
const mainchains = tejaGetMainNetworks()
const testchains = tejaGetTestNetworks()
mainchains.forEach((chain)=>{
  resoluteChainsSet.add(chain.config.chainId)
})
testchains.forEach((chain)=>{
  resoluteChainsSet.add(chain.config.chainId)
})


// to hard coded values
// const resoluteChains = ["cosmoshub-4", "passage-1", "regen-1", "akashnet-2", "osmosis-1", "juno-1", "evmos_9001-2", "stargaze-1", "provider", "passage-1"];
// const resoluteChainsSet = new Set(resoluteChains);

// console.log(resoluteChainsSet);
// console.log(resoluteChainsSet.has("provider"));

// console.log(paths.length)
// paths.forEach((file) => {
//     console.log(file)
// })

let fullassetsMap = new Map();
let assetsMap = new Map();
let chainsMap = new Map();
let idToNameMap = new Map();


paths.forEach((file) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (!data.$schema) {
    console.warn('problematic data:');
   // console.log(data);
    return;
  }
  
  if (data.$schema.endsWith('assetlist.schema.json')) {
      fullassetsMap.set(data.chain_name, data);
  }

  if (data.$schema.endsWith('chain.schema.json') && resoluteChainsSet.has(data.chain_id)) {
      chainsMap.set(data.chain_id, data);
      idToNameMap.set(data.chain_id, data.chain_name);
  }
});

resoluteChainsSet.forEach((chainid) => {
  assetsMap.set(chainid, fullassetsMap.get(idToNameMap.get(chainid)));
})

fullassetsMap = new Map();


const addPaths = glob(`${__dirname}/../chain-registry-additions/**/*.json`);
const addAssets = [];
const addChains = [];

let addset = new Set();
addPaths.forEach((file) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (data.$schema === '../assetlist.schema.json') fullassetsMap.set(data.chain_name, data);
  if (data.$schema === '../chain.schema.json') {
    addChains.push(data);
    addset.add(data.chain_id);
    idToNameMap.set(chain_id, chain_name)
  }
});

addChains.forEach((chain) => {
  if(chainsMap.has(chain.chain_id)) {
    let oldChain = chainsMap.get(chain.chain_id);
    chainsMap.set(chain.chain_id, deepmerge(oldChain, chain));
  }
  else {
    chainsMap.set(chain.chain_id, chain);
  }
});

addset.forEach((addchainid) => {
  addchainname = idToNameMap.get(addchainid);
  if(fullassetsMap.has(addchainname) && assetsMap.has(addchainid)) {
    let oldAsset = assetsMap.get(addchainid);
    assetsMap.set(asset.chainId, deepmerge(oldAsset, fullassetsMap.get(addchainname)));
  }
  else if(fullassetsMap.has(addchainname)) {
    assetsMap.set(addchainid, fullassetsMap.get(addchainname));
  }
});

const transform = (chain) => {

  let chaincurrencies = [];
  chain.assets.forEach((asset) => {
    let exp = 6;
    for(let i=0;i<asset.denom_units.length;i++) {
      if(asset.denom_units[i].denom === asset.display) exp = asset.denom_units[i].exponent;
    }
    chaincurrencies.push({
      coinDenom : asset.symbol,
      coinMinimalDenom : asset.base,
      coinDecimals : exp,
      coinGeckoId : asset.coingecko_id
    });
  })
  let staking = undefined;
  if(chain.staking) {
    let denom = chain.staking.staking_tokens[0]?.denom;
    for(let i=0;i<chaincurrencies.length;i++) {
      if(chaincurrencies[i].coinMinimalDenom === denom) staking = chaincurrencies[i];
    }
  }

  let fees = undefined;

  if(chain.fees?.fee_tokens?.length>0) {
    fees = [];
    for(let i=0;i<chain.fees.fee_tokens.length;i++) {
      for(let j=0;j<chaincurrencies.length; j++) {
        if(chain.fees.fee_tokens[i].denom === chaincurrencies[j].coinMinimalDenom) {
          fees.push(chaincurrencies[j])
        }
      }
    }
  } 
  return {
    enableModules: {
      authz: true,
      feegrant: true,
      group: false,
    },
    aminoConfig: {
      authz: false,
      feegrant: false,
      group: false,
    },
    showAirdrop: false,
    logos : {
      menu : chain.logo_URIs?.png ? chain.logo_URIs.png : "",
      toolbar :  chain.logo_URIs?.png ? chain.logo_URIs.png : "",
    },
    experimental : false,
    isTestnet : true,
    exploreTxHashEndpoint: chain.explorers?.tx_page,
    config: {
      chainId: chain.chain_id,
      chainName: chain.chain_name,
      rest: chain.apis.rest[0], 
      rpc : chain.apis.rpc[0],
      stakeCurrency : staking,
      currencies : chaincurrencies,
      feeCurrencies : fees,
      gasPriceStep: { 
        low: chain.fees?.fee_tokens[0]?.low_gas_price ? chain.fees.fee_tokens.low_gas_price : 0.01,
        average: chain.fees?.fee_tokens[0]?.average_gas_price ? chain.fees.fee_tokens.average_gas_price : 0.025, 
        high: chain.fees?.fee_tokens[0]?.high_gas_price ? chain.fees.fee_tokens.high_gas_price : 0.04 
      },
      coinType : 118,
      bip44 : {coinType : 118},
      bech32Config: {
        bech32PrefixAccAddr: chain.bech32_prefix,
        bech32PrefixAccPub:  chain.bech32_prefix+"pub",
        bech32PrefixValAddr: chain.bech32_prefix+"valoper",
        bech32PrefixValPub:  chain.bech32_prefix+"valoperpub",
        bech32PrefixConsAddr: chain.bech32_prefix+"valcons",
        bech32PrefixConsPub: chain.bech32_prefix+"valconspub",
      },
    },
  }
}

const getTransformedChains = (chainsMap, assetsMap) => {
  //console.log("length", chainsMap.keys(), assetsMap.keys())
  let chains = [];
  chainsMap.forEach((chain, chainId) => {
    if(assetsMap.has(chainId)) {
      mergedchain = deepmerge(chain, assetsMap.get(chainId));
      chains.push(transform(mergedchain));
    }
  })
  return chains;
}

//console.log(assetsMap)

let chains = getTransformedChains(chainsMap, assetsMap);

console.log(resoluteChainsSet)
console.log(chains)

const path = require('path');

// Construct the path to the chains.json file
const chainsFilePath = path.join(__dirname, '..', 'src', 'chains.json');

// Write the data to the file
fs.writeFile(chainsFilePath, JSON.stringify(chains, null, 2), (err) => {
  if (err) {
    throw err;
  }
  console.log('Chains file created and data saved!');
});



const write = (file, json, TypeName, isArray = false) => {
  const strfy = JSON.stringify(json, null, 2);
  const exportType = isArray ? TypeName + '[]' : TypeName;
  fs.writeFileSync(
    `${__dirname}/../src/${file}.ts`,
    `import { ${TypeName} } from '@chain-registry/types';
const ${file}: ${exportType} = ${strfy};
export default ${file};
    `
  );
};

// write(`assets`, assets, 'AssetList', true);
// write(`chains`, chains, 'Chain', true);
// write(`ibc`, ibcs, 'IBCInfo', true);
