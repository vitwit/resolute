import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
const Authz = lazy(() => import('./Authz'));
const Feegrant = lazy(() => import('./Feegrant'));
import { getSelectedNetwork, saveSelectedNetwork } from './../utils/networks'
import Link from '@mui/material/Link';
import { Routes, Route } from "react-router-dom";
import { Validators } from './Validators';
import { Proposals } from './Proposals';
import { useSelector, useDispatch } from 'react-redux'
import { resetWallet, connectKeplrWallet, setNetwork } from './../features/wallet/walletSlice'
import { useNavigate } from "react-router-dom";
const NewFeegrant = lazy(() => import('./NewFeegrant'));
const NewAuthz = lazy(() => import("./NewAuthz"));
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Overview from './Overview';
import { CustomAppBar } from '../components/CustomAppBar';
const AirdropEligibility = lazy(() => import('./AirdropEligibility'));
import { resetError, setError } from '../features/common/commonSlice';
import Page404 from './Page404';
import MultiSig from './Multisig';
import CreateMultisig from './multisig/CreateMultisig';
import Tx_index from './multisig/tx/Tx_index';
import Single_Tx from './multisig/tx/Single_Tx';
import SendPage from './SendPage';
import AppDrawer from '../components/AppDrawer';
import { Alert } from '../components/Alert';
import { getPallet, isDarkMode, mdTheme } from '../utils/theme';
import { isConnected, logout } from '../utils/localStorage';

function DashboardContent(props) {
    const [snackOpen, setSnackOpen] = useState(false);
    const showSnack = (value) => {
        setSnackOpen(value);
    }

    const [darkMode, setDarkMode] = useState(isDarkMode());
    const onModeChange = () => {
        localStorage.setItem('DARK_MODE', !darkMode);
        setDarkMode(!darkMode);
    }

    const [pallet, setPallet] = useState(getPallet());
    const balance = useSelector((state) => state.bank.balance);

    const [snackTxOpen, setSnackTxClose] = useState(false);
    const showTxSnack = (value) => {
        setSnackTxClose(value);
    }

    const [selectedNetwork, setSelectedNetwork] = useState(props.selectedNetwork);
    const changeNetwork = (network) => {
        saveSelectedNetwork(network.config.chainName);
        setSelectedNetwork(network);
        setPallet(getPallet());
    };

    const wallet = useSelector((state) => state.wallet)
    useEffect(() => {
        const network = getSelectedNetwork();
        dispatch(setNetwork({
            chainInfo: network
        }));

        // wait for keplr instance to available
        setTimeout(() => {
            if (isConnected()) {
                dispatch(connectKeplrWallet(network))
            }
        }, 200);

        const listener = () => {
            setTimeout(() => {
                if (isConnected()) {
                    dispatch(connectKeplrWallet(network))
                }
            }, 1000);
        }
        window.addEventListener("keplr_keystorechange", listener);

        setSelectedNetwork(network);
        return () => {
            window.removeEventListener("keplr_keystorechange", listener);
        }
    }, []);

    const chainInfo = useSelector((state) => state.wallet.chainInfo)
    const dispatch = useDispatch()

    const errState = useSelector((state) => state.common.errState);
    const txSuccess = useSelector((state) => state.common.txSuccess);

    useEffect(() => {
        if (errState.message.length > 0 && errState.type.length > 0) {
            showSnack(true)
        } else {
            showSnack(false)
        }
    }, [errState]);

    useEffect(() => {
        if (txSuccess.hash.length > 0) {
            showTxSnack(true)
        } else {
            showTxSnack(false)
        }
    }, [txSuccess]);

    const handleNetworkChange = (network) => {
        dispatch(connectKeplrWallet(network))
        changeNetwork(network);
    }

    function disconnectWallet() {
        logout();
        dispatch(resetWallet());
    }

    const connectWallet = (network) => {
        dispatch(connectKeplrWallet(network))
    }

    let navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(function () {
            dispatch(setError({
                type: 'success',
                message: 'Copied to clipboard'
            }))
            setTimeout(() => {
                showTxSnack(false);
                dispatch(resetError());
            }, 1000);
        }, function (err) {
            dispatch(setError({
                type: 'error',
                message: 'Failed to copy'
            }))
            setTimeout(() => {
                showTxSnack(false);
                dispatch(resetError());
            }, 1000);
        });
    }


    return (
        <ThemeProvider theme={mdTheme(darkMode, pallet.primary, pallet.secondary)}>
            {
                chainInfo?.config ?
                    <>
                        <Box sx={{ display: 'flex' }}>
                            <CssBaseline />
                            <CustomAppBar
                                selectedNetwork={selectedNetwork}
                                onNetworkChange={(network) => handleNetworkChange(network)}
                                darkMode={darkMode}
                                onModeChange={() => onModeChange()}
                            />
                            <AppDrawer
                                balance={balance}
                                chainInfo={chainInfo}
                                onConnectWallet={connectWallet}
                                onDisconnectWallet={disconnectWallet}
                                onNavigate={navigateTo}
                                selectedNetwork={selectedNetwork}
                                wallet={wallet}
                                onCopy={copyToClipboard}
                            />
                            <Box
                                component="main"
                                sx={{
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'light'
                                            ? theme.palette.grey[200]
                                            : theme.palette.grey[900],
                                    flexGrow: 1,
                                    height: '100vh',
                                    overflow: 'auto',
                                }}
                            >
                                <Toolbar />
                                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                    <Routes>
                                        <Route path="/" element={
                                            <Overview />

                                        } />
                                        <Route path="/authz" element={
                                            <Suspense fallback={<CircularProgress />}>
                                                <Authz />
                                            </Suspense>
                                        } />
                                        <Route path="/feegrant" element={
                                            <Suspense fallback={<CircularProgress />}>
                                                <Feegrant />
                                            </Suspense>
                                        }></Route>
                                        <Route path="/feegrant/new" element={
                                            <Suspense fallback={<CircularProgress />}>
                                                <NewFeegrant />
                                            </Suspense>
                                        }></Route>
                                        <Route path="/authz/new" element={
                                            <Suspense fallback={<CircularProgress />}>
                                                <NewAuthz />
                                            </Suspense>
                                        }></Route>
                                        <Route path="/staking" element={<Validators />}></Route>
                                        <Route path="/governance" element={<Proposals />}></Route>
                                        <Route path="/send" element={<SendPage />}></Route>
                                        
                                        {
                                            selectedNetwork.showAirdrop ?
                                                <Route path="/airdrop-check" element={

                                                    <Suspense fallback={<CircularProgress />}>
                                                        <AirdropEligibility /></Suspense>}></Route>
                                                :
                                                <></>
                                        }

                                        <Route path="/multisig" element={<CreateMultisig />}></Route>
                                        <Route path="/multisig/:address/txs" element={<Tx_index />}></Route>
                                        <Route path="/multisig/:address/txs/:txId" element={<Single_Tx />}></Route>
                                        <Route path="*" element={<Page404 />}>
                                        </Route>

                                    </Routes>
                                </Container>
                            </Box>
                        </Box>

                    </>
                    :
                    <></>
            }
            {errState.message.length > 0
                ?
                <Snackbar open={snackOpen && errState.message.length > 0 && errState.type.length > 0} autoHideDuration={3000} onClose={() => { showSnack(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert onClose={() => { showSnack(false) }} severity={errState.type === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
                        {errState.message}
                    </Alert>
                </Snackbar>
                :
                <></>
            }

            <Snackbar open={snackTxOpen} autoHideDuration={3000} onClose={() => { showTxSnack(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={() => { showTxSnack(false) }} severity='success' sx={{ width: '100%' }}>
                    <AlertTitle>Tx Successful</AlertTitle>
                    View on explorer <Link target="_blank" href={`${chainInfo?.explorerTxHashEndpoint}${txSuccess?.hash}`} color='inherit'> {txSuccess?.hash?.toLowerCase().substring(0, 5)}...</Link>
                </Alert>
            </Snackbar>

        </ThemeProvider>
    );
}

export default function Dashboard() {
    const dispatch = useDispatch();

    const network = getSelectedNetwork();
    useEffect(() => {
        dispatch(setNetwork({
            chainInfo: network
        }));

        // wait for keplr instance to available
        setTimeout(() => {
            if (isConnected()) {
                dispatch(connectKeplrWallet(network))
            }
        }, 200);

        const listener = () => {
            setTimeout(() => {
                if (isConnected()) {
                    dispatch(connectKeplrWallet(network))
                }
            }, 1000);
        }
        window.addEventListener("keplr_keystorechange", listener);

        return () => {
            window.removeEventListener("keplr_keystorechange", listener);
        }
    }, []);
    return (
        (
            network ?
                <DashboardContent key={1} selectedNetwork={network} />
                :
                <></>
        )
    );
}