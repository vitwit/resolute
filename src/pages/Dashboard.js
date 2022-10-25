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
import { resetTxLoad } from "../features/common/commonSlice";
import Page404 from "./Page404";
import AppDrawer from "../components/AppDrawer";
import { Alert } from "../components/Alert";
import { getPallet, isDarkMode, mdTheme } from "../utils/theme";
import { isConnected, logout } from "../utils/localStorage";
import { Paper, Typography } from "@mui/material";
import { exitAuthzMode } from "../features/authz/authzSlice";
import { copyToClipboard } from "../utils/clipboard";

const GroupPage = lazy(() => import("./GroupPage"));
const Group = lazy(() => import("./group/Group"));
const Policy = lazy(() => import("./group/Policy"));
const CreateGroupPage = lazy(() => import("./group/CreateGroup"));
const Proposal = lazy(() => import("./group/Proposal"));
const CreateProposal = lazy(() => import("./group/CreateProposal"));

const Authz = lazy(() => import("./Authz"));
const Validators = lazy(() => import("./Validators"));
const Proposals = lazy(() => import("./gov/Proposals"));
const NewAuthz = lazy(() => import("./NewAuthz"));
const AirdropEligibility = lazy(() => import("./passage/AirdropEligibility"));
const PageMultisig = lazy(() => import("./multisig/PageMultisig"));
const PageMultisigInfo = lazy(() => import("./multisig/tx/PageMultisigInfo"));
const SendPage = lazy(() => import("./SendPage"));
const UnjailPage = lazy(() => import("./UnjailPage"));
const ProposalInfo = lazy(() => import("./gov/ProposalInfo"));
const PageCreateTx = lazy(() => import("./multisig/tx/PageCreateTx"));

const Feegrant = lazy(() => import("./Feegrant"));
const NewFeegrant = lazy(() => import("./NewFeegrant"));

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

  const txLoadRes = useSelector((state) => state?.common?.txLoadRes?.load);
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

  const [drawerOpen, setDrawerOpen] = React.useState(true);

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
            toggleDrawer={() => setDrawerOpen(!drawerOpen)}
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
              onCopy={(msg) => copyToClipboard(msg, dispatch)}
              selectedAuthz={selectedAuthz}
              open={drawerOpen}
            />
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
              {selectedAuthz.granter?.length > 0 ? (
                <>
                  <Toolbar />
                  <Toolbar />
                </>
              ) : (
                <Toolbar />
              )}
              <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
                <Routes>
                  <Route path="/" element={<Overview />} />

                  {chainInfo?.config?.enableFeegrant ? (
                    <>
                      <Route
                        path="/feegrant"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <Feegrant />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="/feegrant/new"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <NewFeegrant />
                          </Suspense>
                        }
                      ></Route>
                    </>
                  ) : null}
                  {chainInfo?.config?.enableAuthz ? (
                    <>
                      <Route
                        path="/authz"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <Authz />
                          </Suspense>
                        }
                      />
                      <Route
                        path="/authz/new"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <NewAuthz />
                          </Suspense>
                        }
                      ></Route>
                    </>
                  ) : null}
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
                    path="/proposals/:id"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <ProposalInfo />
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
                        <PageMultisig />
                      </Suspense>
                    }
                  ></Route>

                  <Route
                    path="/multisig/:address/txs"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <PageMultisigInfo />
                      </Suspense>
                    }
                  ></Route>

                  <Route
                    path="/multisig/:address/create-tx"
                    element={
                      <Suspense fallback={<CircularProgress />}>
                        <PageCreateTx />
                      </Suspense>
                    }
                  ></Route>
                  {chainInfo?.config?.enableGroup ? (
                    <>
                      <Route
                        path="/group"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <GroupPage />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="/groups/:id"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <Group />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="/groups/proposals/:id"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <Proposal />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="/groups/:id/policies/:policyId"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <Policy />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="/group/:id/policies/:policyAddress/proposals"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <CreateProposal />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="/group/create-group"
                        element={
                          <Suspense fallback={<CircularProgress />}>
                            <CreateGroupPage />
                          </Suspense>
                        }
                      ></Route>
                    </>
                  ) : null}
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
        open={txLoadRes}
        onClose={() => {
          showTxSnack(false);
        }}
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
          onClose={() => {
            dispatch(resetTxLoad());
          }}
          severity="info"
          sx={{ width: "100%" }}
        >
          <AlertTitle sx={{ width: "100%", display: "flex" }}>
            <Typography> Loading..</Typography>
          </AlertTitle>
          Please wait for sometime.
        </Alert>
      </Snackbar>

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
        Love us by delegating to&nbsp;
        <Typography
          component="span"
          variant="caption"
          fontWeight={600}
          color="text.primary"
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
