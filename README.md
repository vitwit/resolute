# Staking User Interface for Witval
> This user interface have staking actions funtionality for users to delegate, withdraw rewards.

## Install deps 
```bash
# clone the repo with git and checkout to master
$ git clone https://github.com/vitwit/Staking.git
$ cd Staking
$ git checkout master
$ yarn
```

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
