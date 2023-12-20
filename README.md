# Resolute
Resolute is an advanced spacecraft designed to travel through the multiverse, connecting all Cosmos sovereign chains.
Supported features:

- [x] Staking
- [x] Bank
- [x] Governance
- [x] Authz
- [ ] Airdrops
- [x] Multisig
- [ ] Feegrant
- [ ] Groups
- [x] IBC Transfer
- [ ] Cross chain swaps
- [ ] Interchain Accounts
- [ ] Cosmwasm contracts

## Adding new network

To add a new network to Resolute, please follow these steps:

1. Open the frontend/chains directory. 
2. Create a new `<chainname>.json` file. You can refer to the existing examples in the `frontend/chains` folder.


## Install deps 
```bash
# clone the repo with git and checkout to master
$ git clone https://github.com/vitwit/resolute.git
$ cd resolute
$ git checkout master
$ cd frontend
$ yarn
```

## Environment variables

Create .env file and set multisig backend URI `REACT_APP_API_URI`

## Start in DEV Mode 
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
```bash
$ cd frontend
$ yarn run
```

## Testing 
```bash 
$ cd frontend
$ yarn test
```
Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Production Build 
```bash
$ cd frontend
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

## License
Released under the [Apache 2.0 License](https://github.com/vitwit/resolute/blob/master/LICENSE).
