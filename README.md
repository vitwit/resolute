# Resolute
Resolute is an advanced spacecraft designed to travel through the multiverse, connecting all Cosmos sovereign chains.
Supported features:

- [x] Staking
- [x] Bank
- [x] Governance
- [x] Authz
- [ ] Feegrant
- [x] Airdrops
- [ ] Groups
- [x] Multisig

## Adding new network

To add mainet use one of template from the `example` directory and add it to the `mainNets` object in `src/utils/networks.ts`.
To add testnet use one of template from the `example` directory and add it to the `testNets` object in `src/utils/networks.ts`.

* If your network is already registered with Keplr use `example/chain.json` template.
* To register your network with keplr use `example/experimental.json` template.

## Install deps 
```bash
# clone the repo with git and checkout to master
$ git clone https://github.com/vitwit/resolute.git
$ cd resolute
$ git checkout master
$ yarn
```

## Environment variables

Create .env file and set multisig backend URI `REACT_APP_API_URI`

## Start in DEV Mode 
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
```bash
$ yarn start
```

## Testing 
```bash 
$ yarn test
```
Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Production Build 
```bash
$ yarn build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Start with Docker 
```bash
$ make docker-run
# Open the browser with http://localhost:8081
```
