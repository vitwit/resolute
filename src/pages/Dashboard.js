import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Authz from './Authz'
import Feegrant from './Feegrant'
import { getSelectedNetwork, saveSelectedNetwork } from './../utils/networks'
import Link from '@mui/material/Link';
import { Routes, Route } from "react-router-dom";
import { Validators } from './Validators';
import { Proposals } from './Proposals';
import { useSelector, useDispatch } from 'react-redux'
import { resetWallet, connectKeplrWallet } from './../features/wallet/walletSlice'
import { useNavigate } from "react-router-dom";
import NewFeegrant from './NewFeegrant';
import NewAuthz from './NewAuthz';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Overview from './Overview';
import { CustomAppBar } from '../components/CustomAppBar';
import AirdropEligibility from './AirdropEligibility';
import { resetError, setError } from '../features/common/commonSlice';
import Page404 from './Page404';
import SendPage from './SendPage';
import AppDrawer from '../components/AppDrawer';
import {Alert} from '../components/Alert';
import { getPallet, isDarkMode, mdTheme } from '../utils/theme';


function DashboardContent() {
    const [snackOpen, setSnackOpen] = React.useState(false);
    const showSnack = (value) => {
        setSnackOpen(value);
    }

    const [darkMode, setDarkMode] = React.useState(isDarkMode());
    const onModeChange = () => {
        localStorage.setItem('DARK_MODE', !darkMode);
        setDarkMode(!darkMode);
    }

    const [pallet, setPallet] = React.useState(getPallet());
    const balance = useSelector((state) => state.bank.balance);

    const [snackTxOpen, setSnackTxClose] = React.useState(false);
    const showTxSnack = (value) => {
        setSnackTxClose(value);
    }

    const [selectedNetwork, setNetwork] = React.useState(getSelectedNetwork());
    const changeNetwork = (network) => {
        saveSelectedNetwork(network.displayName)
        setNetwork(network);
        setPallet(getPallet())
    };

    const wallet = useSelector((state) => state.wallet)
    React.useEffect(() => {
        // wait for keplr instance to available
        setTimeout(() => {
            dispatch(connectKeplrWallet(selectedNetwork))
        }, 200);

        const listener = () => {
            setTimeout(() => {
                dispatch(connectKeplrWallet(selectedNetwork))
            }, 1000);
        }
        window.addEventListener("keplr_keystorechange", listener);
        return () => {
            window.removeEventListener("keplr_keystorechange", listener);
        }
    }, []);

    const chainInfo = useSelector((state) => state.wallet.chainInfo)
    const dispatch = useDispatch()

    const errState = useSelector((state) => state.common.errState);
    const txSuccess = useSelector((state) => state.common.txSuccess);

    React.useEffect(() => {
        if (errState.message.length > 0 && errState.type.length > 0) {
            showSnack(true)
        } else {
            showSnack(false)
        }
    }, [errState]);

    React.useEffect(() => {
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
                            <Route path="/" element={<Overview />} />
                            <Route path="/authz" element={<Authz />} />
                            <Route path="/feegrant" element={<Feegrant />}></Route>
                            <Route path="/feegrant/new" element={<NewFeegrant />}></Route>
                            <Route path="/authz/new" element={<NewAuthz />}></Route>
                            <Route path="/staking" element={<Validators />}></Route>
                            <Route path="/governance" element={<Proposals />}></Route>
                            <Route path="/send" element={<SendPage />}></Route>
                            {
                                selectedNetwork.showAirdrop ?
                                    <Route path="/airdrop-check" element={<AirdropEligibility />}></Route>
                                    :
                                    <></>
                            }
                            <Route path="*" element={<Page404 />}>
                            </Route>
                        </Routes>
                    </Container>
                </Box>
            </Box>
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
                    View on explorer <Link target="_blank" href={`${chainInfo?.txHashEndpoint}${txSuccess?.hash}`} color='inherit'> {txSuccess?.hash?.toLowerCase().substring(0, 5)}...</Link>
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent key={1} />;
}