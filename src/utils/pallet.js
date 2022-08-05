const networks = {
  "Passage-Testnet": {
    primary: {
      light: "#b7abcf",
      main: "#58467d",
      dark: "#312941",
      contrastText: "#fff",
    },
    secondary: {
      light: "#1de9b6",
      main: "#1de9b6",
      dark: "#14a37f",
      contrastText: "#000",
    },
  },
  "Cosmos Hub": {
    primary: {
      light: "#C5CAE9",
      main: "#3F51B5",
      dark: "#303F9F",
      contrastText: "#fff",
    },
    secondary: {
      light: "#b6a9db",
      main: "#7c4dff",
      dark: "#4a2d9c",
      contrastText: "#000",
    },
  },
  Regen: {
    primary: {
      light: "#80bf98",
      main: "#43ad6b",
      dark: "#2c7849",
      contrastText: "#fff",
    },
    secondary: {
      light: "#8fc9c4",
      main: "#009688",
      dark: "#01786d",
      contrastText: "#000",
    },
  },
  Akash: {
    primary: {
      light: "#c26859",
      main: "#cc3f33",
      dark: "#ad352b",
      contrastText: "#fff",
    },
    secondary: {
      light: "#8fc9c4",
      main: "#009688",
      dark: "#01786d",
      contrastText: "#000",
    },
  },
  Osmosis: {
    primary: {
      light: "#D1C4E9",
      main: "#673AB7",
      dark: "#512DA8",
      contrastText: "#fff",
    },
    secondary: {
      light: "#8fc9c4",
      main: "#009688",
      dark: "#01786d",
      contrastText: "#000",
    },
  },
  Juno: {
    primary: {
      light: "#5e4749",
      main: "#523d3f",
      dark: "#312526",
      contrastText: "#fff",
    },
    secondary: {
      light: "#8fc9c4",
      main: "#009688",
      dark: "#01786d",
      contrastText: "#000",
    },
  },
};

const defaultPallet = {
  primary: {
    light: "#6573c3",
    main: "#3f51b5",
    dark: "#2c387e",
    contrastText: "#fff",
  },
  secondary: {
    light: "#1de9b6",
    main: "#1de9b6",
    dark: "#14a37f",
    contrastText: "#000",
  },
};

export function getPalletByNetwork(networkName) {
  if (networkName === "") return defaultPallet;
  const pallet = networks[networkName];
  if (!pallet) return defaultPallet;
  return pallet;
}
