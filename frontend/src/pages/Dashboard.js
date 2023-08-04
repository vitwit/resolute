import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useSelector, useDispatch } from "react-redux";
import { connectWalletV1 } from "./../features/wallet/walletSlice";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import { CustomAppBar } from "../components/CustomAppBar";
import { resetTxLoad } from "../features/common/commonSlice";
import { Alert } from "../components/Alert";
import { isDarkMode, mdTheme } from "../utils/theme";
import { Paper, Typography } from "@mui/material";
import Home from "./Home";
import { defaultPallet } from "../utils/pallet";
import {
  KEY_DARK_MODE,
  KEY_WALLET_NAME,
  removeAllFeegrants,
} from "../utils/localStorage";
import { resetFeegrantState } from "../features/feegrant/feegrantSlice";
import { networks } from "../utils/chainsInfo";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [snackOpen, setSnackOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(isDarkMode());
  const [snackTxOpen, setSnackTxClose] = useState(false);

  const showSnack = (value) => setSnackOpen(value);

  const onModeChange = () => {
    localStorage.setItem(KEY_DARK_MODE, !darkMode);
    setDarkMode(!darkMode);
  };

  const showTxSnack = (value) => setSnackTxClose(value);

  const commonState = useSelector((state) => state?.common);
  const selectedNetwork = commonState.selectedNetwork.chainName;
  const allNetworks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[selectedNetwork];
  const chainInfo = allNetworks[chainID]?.network;
  const txLoadRes = commonState.txLoadRes?.load;
  const errState = commonState.errState;
  const txSuccess = commonState.txSuccess;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const walletName = localStorage.getItem(KEY_WALLET_NAME);
    let wallet;

    if (walletName === "keplr") {
      wallet = window.keplr;
    } else if (walletName === "leap") {
      wallet = window.leap;
    }

    if (wallet) {
      window.wallet = wallet;
      setTimeout(() => {
        dispatch(
          connectWalletV1({
            mainnets: networks,
            testnets: [],
            walletName,
          })
        );
      }, 1000);

      const accountChangeListener = () => {
        navigate("/");
        window.location.reload();
        window.wallet = wallet;
        setTimeout(() => {
          dispatch(
            connectWalletV1({
              mainnets: networks,
              testnets: [],
              walletName,
            })
          );
        }, 1000);

        removeAllFeegrants();
        dispatch(resetFeegrantState());
      };

      window.addEventListener(
        `${walletName}_keystorechange`,
        accountChangeListener
      );

      return () => {
        window.removeEventListener(
          `${walletName}_keystorechange`,
          accountChangeListener
        );
      };
    }
  }, []);

  useEffect(() => {
    if (errState?.message?.length > 0 && errState?.type?.length > 0) {
      showSnack(true);
    } else {
      showSnack(false);
    }
  }, [errState]);

  useEffect(() => {
    if (txSuccess?.hash?.length > 0) {
      showTxSnack(true);
    } else {
      showTxSnack(false);
    }
  }, [txSuccess]);

  return (
    <ThemeProvider
      theme={mdTheme(darkMode, defaultPallet.primary, defaultPallet.secondary)}
    >
      <CustomAppBar darkMode={darkMode} onModeChange={() => onModeChange()} />
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "96vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 1, mb: 2 }}>
            <Home />
          </Container>
        </Box>
      </Box>
      <Footer />

      {errState?.message?.length > 0 && (
        <Snackbar
          open={
            snackOpen &&
            errState?.message?.length > 0 &&
            errState?.type?.length > 0
          }
          autoHideDuration={3000}
          onClose={() => showSnack(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => showSnack(false)}
            severity={errState.type === "success" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errState.message}
          </Alert>
        </Snackbar>
      )}

      <Snackbar
        open={txLoadRes}
        onClose={() => showTxSnack(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          iconMapping={{
            info: (
              <CircularProgress
                size={35}
                sx={{ color: "#FFF", mr: 2, mt: 1 }}
              />
            ),
          }}
          onClose={() => dispatch(resetTxLoad())}
          severity="info"
          sx={{ width: "100%" }}
        >
          <AlertTitle sx={{ width: "100%", display: "flex" }}>
            <Typography> Loading..</Typography>
          </AlertTitle>
          Please wait for some time.
        </Alert>
      </Snackbar>

      {txSuccess?.hash?.length > 0 && (
        <Snackbar
          open={snackTxOpen}
          autoHideDuration={3000}
          onClose={() => showTxSnack(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => showTxSnack(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            <AlertTitle>Transaction Broadcasted</AlertTitle>
            View on explorer{" "}
            <Link
              target="_blank"
              href={`${chainInfo?.explorerTxHashEndpoint}${txSuccess?.hash}`}
              color="inherit"
            >
              {" "}
              {txSuccess?.hash?.toLowerCase().substring(0, 5)}...
            </Link>
          </Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
}

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={0}
      className="footer"
      sx={{
        borderRadius: 0,
        p: 0.5,
      }}
    >
      <Typography component="span" variant="caption" color="text.secondary">
        Love us by delegating to&nbsp;
        <Typography
          component="span"
          variant="caption"
          fontWeight={600}
          color="text.primary"
          onClick={() => navigate("/staking")}
        >
          Witval
        </Typography>
      </Typography>
      {/* <Typography
        component="span"
        variant="caption"
        fontWeight={600}
        color="text.primary"
        className="footer-link"
        onClick={() => {
          window.open("https://vitwit.com", "_blank");
        }}
      >
        &nbsp;Vitwit
      </Typography> */}
    </Paper>
  );
};
