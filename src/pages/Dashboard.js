import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { mainListItems } from './listItems';
import Authz from './Authz'
import Feegrant from './Feegrant'
import { getNetworks, getSelectedNetwork, saveSelectedNetwork } from './../utils/networks'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Routes, Route } from "react-router-dom";
import { Validators } from './Validators';
import { Proposals } from './Proposals';
import { useSelector, useDispatch } from 'react-redux'
import { setWallet, resetWallet, setKeplr } from './../features/wallet/walletSlice'
import { useNavigate } from "react-router-dom";
import NewFeegrant from './NewFeegrant';
import NewAuthz from './NewAuthz';
import { shortenAddress } from '../utils/util';
import { ListItem } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Overview from './Overview';
import { Send } from './Send';
import { WithdrawRewards } from './WithdrawRewards';
import { getKeplrWalletAmino, isKeplrInstalled } from '../txns/execute';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const drawerWidth = 210;

const mdTheme = createTheme();

function DashboardContent() {
    const [snackOpen, setSnackClose] = React.useState(false);
    const [isLogin, setLogin] = React.useState(localStorage.getItem('IS_LOGIN'));

    const showSnack = (value) => {
        setSnackClose(value);
    }

    const [snackTxOpen, setSnackTxClose] = React.useState(false);

    const showTxSnack = (value) => {
        setSnackTxClose(value);
    }

    const [selectedNetwork, setNetwork] = React.useState(getSelectedNetwork());
    const changeNetwork = (network) => {
        saveSelectedNetwork(network.displayName)
        setNetwork(network);
    };

    React.useEffect(() => {
        window.addEventListener("keplr_keystorechange", () => {
            if (!walletConnected) {
                if (isLogin) {
                    disconnectWallet()
                    setTimeout(() => {
                        connectWallet(selectedNetwork)
                    },1000);
                }
            }
      });
      });


    const [anchorEl, setAnchorEl] = React.useState(false);
    const menuOpen = anchorEl;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const walletConnected = useSelector((state) => state.wallet.connected)
    const walletStatus = useSelector((state) => state.wallet)
    const chainInfo = useSelector((state) => state.wallet.chainInfo)
    const dispatch = useDispatch()

    const errState = useSelector((state) => state.common.errState);
    const txSuccess = useSelector((state) => state.common.txSuccess);

    React.useEffect(() => {
        if (errState.message === '') {
            showSnack(false)
        } else {
            showSnack(true)
        }
    }, [errState]);

    React.useEffect(() => {
        if (txSuccess.hash === '') {
            showTxSnack(false)
        } else {
            showTxSnack(true)
        }
    }, [txSuccess]);

    React.useEffect(() => {
        if (!walletConnected) {
            if (isLogin) {
                connectWallet(selectedNetwork)
            }
        }
    }, [walletConnected]);

    const handleNetworkChange = (network) => {
        setAnchorEl(false);
        changeNetwork(network)
        disconnectWallet()
        connectWallet(network)
    }

    function disconnectWallet() {
        setLogin(false)
        localStorage.setItem('IS_LOGIN', false);
        dispatch(resetWallet())
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
                  preferNoSetFee: true,
                  disableBalanceCheck: true,
                },
            };
            if (network.experimental) {
                window.keplr.experimentalSuggestChain(network.config)
                    .then((v) => {
                        setLogin(true);
                        localStorage.setItem('IS_LOGIN', true);
                        enableConnection(network)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                setLogin(true);
                localStorage.setItem('IS_LOGIN', true);
                enableConnection(network)
            }
        }

    }

    const enableConnection = (network) => {
        getKeplrWalletAmino(network.chainId)
        .then((result) => {
            dispatch(setWallet({
                address: result[1].address,
                chainInfo: network
            }))
        })
        .catch((err) => {
            alert(err);
        })
        
        // window.keplr?.enable(network.chainId)
        //     .then(() => {
        //         const offlineSigner = window.getOfflineSigner(network.chainId);
        //         offlineSigner.getAccounts().then((accounts) => {
        //             dispatch(setKeplr(offlineSigner));
        //             dispatch(setWallet({
        //                 ...accounts[0],
        //                 chainInfo: network
        //             }))
        //         })
        //             .catch((err) => {
        //                 console.log(err)
        //             })
        //     })

        //     .catch(() => {
        //         alert("permission denied")
        //     })
    }


    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                            align='left'
                        >
                            Staking UI
                        </Typography>
                        <Button
                            id="demo-positioned-button"
                            color='inherit'
                            endIcon={<ExpandMoreOutlinedIcon />}
                            aria-controls={menuOpen ? 'demo-positioned-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            {selectedNetwork.displayName}
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={() => setAnchorEl(false)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            {
                                getNetworks().map((network, index) => (
                                    <MenuItem
                                        key={index}
                                        onClick={() => handleNetworkChange(network)}
                                    >
                                        {network.displayName}
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </Toolbar>
                </AppBar>
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
                            walletConnected ?
                                <>
                                    <ListItem>
                                        <Typography variant='h6'
                                            color='text.primary' size={16} >
                                            {walletStatus.name}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Chip label={shortenAddress(walletStatus.address, 21)} size="small" />
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
                        {mainListItems((path) => { navigateTo(path) })}
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
                            <Route path="/withdraw-rewards" element={<WithdrawRewards />}></Route>
                        </Routes>
                    </Container>
                </Box>
            </Box>

            <Snackbar open={snackOpen} autoHideDuration={2000} onClose={() => { showSnack(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={() => { showSnack(false) }} severity={errState.type === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {errState.message}
                </Alert>
            </Snackbar>

            <Snackbar open={snackTxOpen} autoHideDuration={3000} onClose={() => { showTxSnack(false) }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={() => { showTxSnack(false) }} severity='success' sx={{ width: '100%' }}>
                <Link target="_blank" href={`${chainInfo?.txHashEndpoint}${txSuccess?.hash}`} color='inherit'>{txSuccess?.hash}</Link>
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent key={1} />;
}