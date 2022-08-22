import React, { Suspense, lazy, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { getSelectedNetwork, saveSelectedNetwork } from "./../utils/networks";
import Link from "@mui/material/Link";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  resetWallet,
  connectKeplrWallet,
  setNetwork,
} from "./../features/wallet/walletSlice";
import { useNavigate } from "react-router-dom";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import Overview from "./Overview";
import { CustomAppBar } from "../components/CustomAppBar";
import { resetError, setError } from "../features/common/commonSlice";
import Page404 from "./Page404";
import AppDrawer from "../components/AppDrawer";
import { Alert } from "../components/Alert";
import { getPallet, isDarkMode, mdTheme } from "../utils/theme";
import { isConnected, logout } from "../utils/localStorage";
import { Paper, Typography } from "@mui/material";
import { exitAuthzMode } from "../features/authz/authzSlice";
import GroupPage from "./GroupPage";
import CreateGroupPage from "./group/CreateGroup";
const Authz = lazy(() => import("./Authz"));
// const Feegrant = lazy(() => import("./Feegrant"));
const Validators = lazy(() => import("./Validators"));
const Proposals = lazy(() => import("./Proposals"));
// const NewFeegrant = lazy(() => import("./NewFeegrant"));
const NewAuthz = lazy(() => import("./NewAuthz"));
const AirdropEligibility = lazy(() => import("./AirdropEligibility"));
const CreateMultisig = lazy(() => import("./multisig/CreateMultisig"));
const Tx_index = lazy(() => import("./multisig/tx/Tx_index"));
const Single_Tx = lazy(() => import("./multisig/tx/Single_Tx"));
const SendPage = lazy(() => import("./SendPage"));
const UnjailPage = lazy(() => import("./UnjailPage"));

function DashboardContent(props) {
  const [snackOpen, setSnackOpen] = useState(false);
  const showSnack = (value) => {
    setSnackOpen(value);
  };

  const [darkMode, setDarkMode] = useState(isDarkMode());
  const onModeChange = () => {
    localStorage.setItem("DARK_MODE", !darkMode);
    setDarkMode(!darkMode);
  };

  const [pallet, setPallet] = useState(getPallet());
  const balance = useSelector((state) => state.bank.balance);

  const [snackTxOpen, setSnackTxClose] = useState(false);
  const showTxSnack = (value) => {
    setSnackTxClose(value);
  };
  const selectedAuthz = useSelector((state) => state.authz.selected);

  const [selectedNetwork, setSelectedNetwork] = useState(props.selectedNetwork);
  const changeNetwork = (network) => {
    saveSelectedNetwork(network.config.chainName);
    setSelectedNetwork(network);
    setPallet(getPallet());
  };

  const wallet = useSelector((state) => state.wallet);
  useEffect(() => {
    const network = getSelectedNetwork();
    dispatch(
      setNetwork({
        chainInfo: network,
      })
    );

    // wait for keplr instance to available
    setTimeout(() => {
      if (isConnected()) {
        dispatch(connectKeplrWallet(network));
      }
    }, 200);

    const listener = () => {
      setTimeout(() => {
        if (isConnected()) {
          dispatch(connectKeplrWallet(network));
        }
      }, 1000);
    };
    window.addEventListener("keplr_keystorechange", listener);

    setSelectedNetwork(network);
    return () => {
      window.removeEventListener("keplr_keystorechange", listener);
    };
  }, []);

  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const dispatch = useDispatch();

  const errState = useSelector((state) => state.common.errState);
  const txSuccess = useSelector((state) => state.common.txSuccess);

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

  const handleNetworkChange = (network) => {
    dispatch(connectKeplrWallet(network));
    changeNetwork(network);
  };

  function disconnectWallet() {
    logout();
    if (selectedAuthz.granter?.length > 0) {
      dispatch(exitAuthzMode());
    }
    dispatch(resetWallet());
  }

  const connectWallet = (network) => {
    dispatch(connectKeplrWallet(network));
  };

  let navigate = useNavigate();
  function navigateTo(path) {
    navigate(path);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      function () {
        dispatch(
          setError({
            type: "success",
            message: "Copied to clipboard",
          })
        );
        setTimeout(() => {
          showTxSnack(false);
          dispatch(resetError());
        }, 1000);
      },
      function (err) {
        dispatch(
          setError({
            type: "error",
            message: "Failed to copy",
          })
        );
        setTimeout(() => {
          showTxSnack(false);
          dispatch(resetError());
        }, 1000);
      }
    );
  };

  return (
    <ThemeProvider
      theme={mdTheme(darkMode, pallet?.primary, pallet?.secondary)}
    >
      {chainInfo?.config ? (
        <>
          <CustomAppBar
            selectedNetwork={selectedNetwork}
            onNetworkChange={(network) => handleNetworkChange(network)}
            darkMode={darkMode}
            onModeChange={() => onModeChange()}
            onExit={() => {
              dispatch(exitAuthzMode());
              setTimeout(() => {
                navigateTo("/");
              }, 400);
            }}
          />
          <Box sx={{ display: "flex" }}>
            <AppDrawer
              balance={balance}
              chainInfo={chainInfo}
              onConnectWallet={connectWallet}
              onDisconnectWallet={disconnectWallet}
              onNavigate={navigateTo}
              selectedNetwork={selectedNetwork}
              wallet={wallet}
              onCopy={copyToClipboard}
              selectedAuthz={selectedAuthz}
            />
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              {selectedAuthz.granter?.length > 0 ? (
                <>
                  <Toolbar />
                  <Toolbar />
                </>
              ) : (
                <Toolbar />
              )}
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route
                    path="/authz"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <Authz />
                      </Suspense>
                    }
                  />
                  {/* <Route
                    path="/feegrant"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <Feegrant />
                      </Suspense>
                    }
                  ></Route> */}
                  {/* <Route
                    path="/feegrant/new"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <NewFeegrant />
                      </Suspense>
                    }
                  ></Route> */}
                  <Route
                    path="/authz/new"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <NewAuthz />
                      </Suspense>
                    }
                  ></Route>
                   <Route
                    path="/slashing"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <UnjailPage />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/staking"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <Validators />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/governance"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <Proposals />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/send"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <SendPage />
                      </Suspense>
                    }
                  ></Route>

                  {selectedNetwork.showAirdrop ? (
                    <Route
                      path="/airdrop-check"
                      element={
                        <Suspense fallback={<CircularProgress />}>
                          <AirdropEligibility />
                        </Suspense>
                      }
                    ></Route>
                  ) : (
                    <></>
                  )}
                  <Route
                    path="/multisig"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <CreateMultisig />
                      </Suspense>
                    }
                  ></Route>

                  <Route
                    path="/multisig/:address/txs"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <Tx_index />
                      </Suspense>
                    }
                  ></Route>

                  <Route
                    path="/multisig/:address/txs/:txId"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <Single_Tx />
                      </Suspense>
                    }
                  ></Route>
                  <Route path="/group" element={<GroupPage />}></Route>
                  <Route
                    path="/group/create-group"
                    element={<CreateGroupPage />}
                  ></Route>
                  <Route path="*" element={<Page404 />}></Route>
                </Routes>
              </Container>
            </Box>
          </Box>
          <Footer />
        </>
      ) : (
        <></>
      )}
      {errState.message.length > 0 ? (
        <Snackbar
          open={
            snackOpen &&
            errState.message?.length > 0 &&
            errState.type?.length > 0
          }
          autoHideDuration={3000}
          onClose={() => {
            showSnack(false);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => {
              showSnack(false);
            }}
            severity={errState.type === "success" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errState.message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}

      <Snackbar
        open={snackTxOpen}
        autoHideDuration={3000}
        onClose={() => {
          showTxSnack(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => {
            showTxSnack(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Tx Successful</AlertTitle>
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
    </ThemeProvider>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();

  const network = getSelectedNetwork();
  useEffect(() => {
    dispatch(
      setNetwork({
        chainInfo: network,
      })
    );

    // wait for keplr instance to available
    setTimeout(() => {
      if (isConnected()) {
        dispatch(connectKeplrWallet(network));
      }
    }, 200);

    const listener = () => {
      setTimeout(() => {
        if (isConnected()) {
          dispatch(connectKeplrWallet(network));
        }
      }, 1000);
    };
    window.addEventListener("keplr_keystorechange", listener);

    return () => {
      window.removeEventListener("keplr_keystorechange", listener);
    };
  }, []);
  return network ? (
    <DashboardContent key={1} selectedNetwork={network} />
  ) : (
    <></>
  );
}

const Footer = () => {
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
      Love us by delegating to Witval
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
