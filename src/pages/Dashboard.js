import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { mainListItems } from './listItems';
import Authz from './Authz'
import Feegrant from './Feegrant'
import { getSelectedNetwork, saveSelectedNetwork } from './../utils/networks'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import { Routes, Route, useLocation } from "react-router-dom";
import { Validators } from './Validators';
import { Proposals } from './Proposals';
import { useSelector, useDispatch } from 'react-redux'
import { setWallet, resetWallet } from './../features/wallet/walletSlice'
import { useNavigate } from "react-router-dom";
import NewFeegrant from './NewFeegrant';
import NewAuthz from './NewAuthz';
import { shortenAddress } from '../utils/util';
import { AlertTitle, ListItem, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Overview from './Overview';
import { Send } from './Send';
import { getKeplrWalletAmino, isKeplrInstalled } from '../txns/execute';
import { CustomAppBar } from '../components/CustomAppBar';
import AirdropEligibility from './AirdropEligibility';
import { resetError, setError } from '../features/common/commonSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function isDarkMode() {
    const mode = localStorage.getItem("DARK_MODE");
    if (mode === "true") {
        return true;
    } else {
        return false;
    }
}

const drawerWidth = 210;

const mdTheme = (isDarkMode) => createTheme({
    palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
            light: '#6573c3',
            main: '#3f51b5',
            dark: '#2c387e',
            contrastText: '#fff',
        },
        secondary: {
            light: '#1de9b6',
            main: '#1de9b6',
            dark: '#14a37f',
            contrastText: '#000',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Ubuntu',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },

});

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



    const location = useLocation();

    const [snackTxOpen, setSnackTxClose] = React.useState(false);
    const showTxSnack = (value) => {
        setSnackTxClose(value);
    }

    const [selectedNetwork, setNetwork] = React.useState(getSelectedNetwork());
    const changeNetwork = (network) => {
        saveSelectedNetwork(network.displayName)
        setNetwork(network);
    };

    const wallet = useSelector((state) => state.wallet)
    React.useEffect(() => {
        setDarkMode(darkMode);

        // wait for keplr instance to available
        setTimeout(() => {
            connectWallet(selectedNetwork)
        }, 200);

        const listener = () => {
            setTimeout(() => {
                connectWallet(selectedNetwork)
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
        dispatch(resetWallet());
        changeNetwork(network);
    }

    function disconnectWallet() {
        dispatch(resetWallet());
    }

    let navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }

    const connectWallet = (network) => {
        if (!isKeplrInstalled()) {
            alert("keplr extension is not installed")
        } else {
            window.keplr.defaultOptions = {
                sign: {
                    preferNoSetMemo: true,
                    // preferNoSetFee: true,
                    disableBalanceCheck: true,
                },
            };
            if (network.experimental) {
                window.keplr.experimentalSuggestChain(network.config)
                    .then((v) => {
                        enableConnection(network)
                    })
                    .catch((error) => {
                        alert(error);
                    })
            } else {
                enableConnection(network)
            }
        }

    }

    const [walletName, setWalletName] = React.useState("");
    const enableConnection = (network) => {
        getKeplrWalletAmino(network.chainId)
            .then((result) => {
                dispatch(setWallet({
                    address: result[1].address,
                    chainInfo: network
                }))
            })
            .catch((err) => {
                disconnectWallet();
                alert(err);
            })

        if (window.keplr) {
            window.keplr.getKey(network.chainId)
                .then((result) => {
                    setWalletName(result?.name);
                })
                .catch((error) => {
                    setWalletName("");
                })
        }
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
        <ThemeProvider theme={mdTheme(darkMode)}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <CustomAppBar
                    selectedNetwork={selectedNetwork}
                    onNetworkChange={(network) => handleNetworkChange(network)}
                    darkMode={darkMode}
                    onModeChange={() => onModeChange()}
                />
                <Drawer variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <List component="nav" style={{ minHeight: 120 }}>
                        {
                            wallet.connected ?
                                <>
                                    <ListItem
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <Typography
                                            color='text.primary'
                                            variant='body1'
                                            fontWeight={600}
                                        >
                                            {walletName}
                                        </Typography>
                                    </ListItem>
                                    <ListItem
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <Chip
                                            label={shortenAddress(wallet.address, 21)}
                                            size="small"
                                            deleteIcon={<ContentCopyOutlined />}
                                            onDelete={() => { copyToClipboard(wallet.address) }}
                                        />
                                    </ListItem>
                                    <ListItem style={{ justifyContent: 'center' }}>
                                        <Button
                                            endIcon={<LogoutOutlinedIcon />}
                                            size='small'
                                            variant='outlined'
                                            style={{ textTransform: 'capitalize' }}
                                            disableElevation
                                            onClick={() => disconnectWallet()}
                                        >
                                            Disconnect
                                        </Button>
                                    </ListItem>
                                </>
                                :
                                <>
                                    <ListItem />
                                    <ListItem />
                                    <ListItem />
                                    <ListItem style={{ justifyContent: 'center' }}>

                                        <Button
                                            startIcon={<AccountBalanceWalletOutlinedIcon />}
                                            size='small'
                                            variant='contained'
                                            disableElevation
                                            onClick={() => connectWallet(selectedNetwork)}
                                        >
                                            Connect Wallet
                                        </Button>
                                    </ListItem>
                                </>
                        }
                    </List>
                    <Divider />
                    <List component="nav">
                        {mainListItems(location.pathname,(path) => {  navigateTo(path) }, selectedNetwork?.showAirdrop)}
                    </List>

                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
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
                            <Route path="/validators" element={<Validators />}></Route>
                            <Route path="/proposals" element={<Proposals />}></Route>
                            <Route path="/send" element={<Send />}></Route>
                            <Route path="/airdrop-check" element={<AirdropEligibility />}></Route>
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