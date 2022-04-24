import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from './listItems';
import Authz from './Authz'
import Feegrant from './Feegrant'
import { getNetworks } from './../utils/networks'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Routes, Route } from "react-router-dom";
import { Validators } from './Validators';
import { Proposals } from './Proposals';
import { useSelector, useDispatch } from 'react-redux'
import { setWallet, resetWallet } from './../features/wallet/walletSlice'
import { useNavigate } from "react-router-dom";
import NewFeegrant from './NewFeegrant';
import NewAuthz from './newAuthz';
import { shortenAddress } from '../utils/util';
import { ListItem } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

function DashboardContent() {



    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [selectedNetwork, setNetwork] = React.useState(getNetworks()[0]);
    const changeNetwork = (network) => {
        setNetwork(network);
    };


    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = anchorEl;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const walletConnected = useSelector((state) => state.wallet.connected)
    const walletStatus = useSelector((state) => state.wallet)
    const dispatch = useDispatch()

    const handleNetworkChange = (network) => {
        setAnchorEl(null);
        changeNetwork(network)
        disconnectWallet()
        connectWallet(network)
    }

    function isKeplrInstalled() {
        return window.keplr == null ? false : true
    }

    function disconnectWallet() {
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
            if (network.experimental) {
                window.keplr.experimentalSuggestChain(network.config)
                    .then((v) => {
                        enableConnection(network)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                enableConnection(network)
            }
        }

    }

    const enableConnection = (network) => {
        window.keplr?.enable(network.chainId)
            .then(() => {
                window.keplr?.getKey(network.chainId)
                    .then((value) => {
                        dispatch(setWallet({
                            ...value,
                            chainInfo: network
                        }))
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            })
            .catch(() => {
                alert("permission denied")
            })
    }


    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                            align='left'
                        >
                            App
                        </Typography>
                        <Button
                            id="demo-positioned-button"
                            color='inherit'
                            endIcon={<ExpandMoreOutlinedIcon/>}
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
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
                            onClose={() => setAnchorEl(null)}
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
                                getNetworks().map((network) => (
                                    <MenuItem
                                        onClick={() => handleNetworkChange(network)}
                                    >
                                        {network.displayName}
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />

                    <List component="nav">
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
                                        <Chip label={shortenAddress(walletStatus.bech32Address, 19)} size="small" />
                                    </ListItem>
                                    <ListItem style={{ justifyContent: 'center' }}>
                                        <Button
                                            startIcon={<LogoutOutlinedIcon />}
                                            size='small'
                                            variant='outlined'
                                            disableElevation
                                            onClick={() => disconnectWallet()}
                                        >
                                            Disconnect
                                        </Button>
                                    </ListItem>
                                </>
                                :
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
                            <Route path="/authz" element={<Authz />} />
                            <Route path="/feegrant" element={<Feegrant />}></Route>
                            <Route path="/feegrant/new" element={<NewFeegrant />}></Route>
                            <Route path="/authz/new" element={<NewAuthz />}></Route>
                            <Route path="/validators" element={<Validators />}></Route>
                            <Route path="/proposals" element={<Proposals />}></Route>
                        </Routes>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}