# Resolute
Resolute is an advanced spacecraft designed to travel through the multiverse, connecting all Cosmos sovereign chains.
Supported features:

- [x] Overview
- [x] Staking
- [x] Bank
- [x] Governance
- [x] Multisig
<<<<<<< HEAD
- [x] IBC Transfer
=======
>>>>>>> bd4565202a559ad2014a2b65ae950051629cdd9e
- [ ] Authz
- [ ] Airdrops
- [ ] Feegrant
- [ ] Groups
<<<<<<< HEAD
=======
- [ ] IBC Transfer
>>>>>>> bd4565202a559ad2014a2b65ae950051629cdd9e
- [ ] Cross chain swaps
- [ ] Interchain Accounts
- [ ] Cosmwasm contracts

## Adding new network

To add a new network to Resolute, please follow these steps:

1. Open the frontend/chains directory. 
2. Create a new `<chainname>.json` file. You can refer to the existing examples in the `frontend/chains` folder.

## Prerequisites

1. Install node 18.0.0 or above

## For older version
Use release/v1.x branch

## Install deps 
```bash
# clone the repo with git and checkout to master
$ git clone https://github.com/vitwit/resolute.git
$ cd resolute
$ git checkout master
$ cd frontend
$ yarn dev
```

## Environment variables

Create .env file and set multisig backend URI `NEXT_PUBLIC_APP_API_URI`
You can setup your own mulitisig server in [Set up multisig server](./MULTISIG_SERVER_README.md).

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

## License
Released under the [Apache 2.0 License](https://github.com/vitwit/resolute/blob/master/LICENSE).
