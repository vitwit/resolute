# Resolute
Resolute is your gateway to the Cosmos ecosystem. It enables users to seamlessly interact with any blockchain built using the Cosmos SDK stack, all while using the wallet of their choice. Whether you're a developer, validator, or an everyday user, Resolute offers a streamlined experience to connect and engage with the diverse Cosmos universe.

Supported features:

- [x] Overview
- [x] Staking
- [x] Bank
- [x] Governance
- [x] Multisig
- [x] IBC Transfer
- [x] IBC Swap
- [x] Authz
- [x] Feegrant
- [x] Cosmwasm contracts
- [x] Multi-Message Transaction Builder
- [ ] Airdrops
- [ ] Groups
- [x] Cross chain swaps
- [ ] Interchain Accounts

## Prerequisites

1. Install node 18.0.0 or above

## Install deps 
```bash
# clone the repo with git and checkout to v2.0.0
$ git clone https://github.com/vitwit/resolute.git
$ cd resolute
$ git checkout v2.0.0
$ cd frontend
$ yarn
```

## Environment variables

Rename `.env.example` to `.env` and set backend sever URI `NEXT_PUBLIC_APP_API_URI`.

Backend server setup: [Set up backend server](./BACKEND_SERVER_README.md).

Set Squid ID `NEXT_PUBLIC_SQUID_ID`, You can get Squid ID from here [Squid ID](https://squidrouter.typeform.com/integrator-id?typeform-source=docs.squidrouter.com)

To use Cosmwasm contracts set `NEXT_PUBLIC_DUMMY_WALLET_MNEMONIC`.

Set Squid ID `NEXT_PUBLIC_SQUID_ID`, You can get Squid ID from here [Squid ID](https://squidrouter.typeform.com/integrator-id?typeform-source=docs.squidrouter.com)

To use Cosmwasm contracts set `NEXT_PUBLIC_DUMMY_WALLET_MNEMONIC`.

## Start in DEV Mode
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
```bash
$ cd frontend
$ yarn dev
```

## Production Build 
```bash
$ cd frontend
$ yarn build
$ yarn start
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## How to add a new network to available networks

To add a new network to Resolute, please follow these steps:

1. Open the `frontend/src/utils/chainInfo.ts` file. 
2. Add the new network configuration to the networks list. You can refer to the existing network configurations.
3. Open the `server/networks.json` file and add the new network configuration.
4. Add the token denom and coingecko-id in backend for token price. (Refer: [Set up backend server](./BACKEND_SERVER_README.md))

## License
Released under the [MIT License](https://github.com/vitwit/resolute/blob/master/LICENSE).
