import React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import Button from '@mui/material/Button'
import PropTypes from 'prop-types';
import { drawerListItems } from './drawerListItems';
import { totalBalance } from '../utils/denom';
import { shortenAddress } from '../utils/util';
import { useLocation } from 'react-router-dom';

const drawerWidth = 210;
export default function AppDrawer(props) {
    const { wallet, onDisconnectWallet, onNavigate, onConnectWallet,
        selectedNetwork, balance, chainInfo, onCopy } = props;

    const location = useLocation();
    return (
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
                                style={{ justifyContent: 'left' }}
                            >
                                <AccountBalanceWalletOutlinedIcon />
                                &nbsp;
                                <Typography
                                    color='text.primary'
                                    variant='body1'
                                    fontWeight={500}
                                >
                                    {wallet.name}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Chip
                                    label={shortenAddress(wallet.address, 21)}
                                    size="small"
                                    deleteIcon={<ContentCopyOutlined />}
                                    onDelete={() => { onCopy(wallet.address) }}
                                />
                            </ListItem>
                            <ListItem style={{ paddingBottom: 0 }}>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                >
                                    PubKey
                                </Typography>
                                </ListItem>
                                <ListItem
                            >
                            <Chip
                                    label={shortenAddress(wallet.pubKey, 21)}
                                    size="small"
                                    deleteIcon={<ContentCopyOutlined />}
                                    onDelete={() => { onCopy(wallet.pubKey) }}
                                />
                            </ListItem>
                            <ListItem style={{ paddingBottom: 0 }}>
                                <Typography
                                    color='text.secondary'
                                    variant='caption'
                                    fontWeight={400}
                                >
                                    Available Balance
                                </Typography>
                            </ListItem>
                            <ListItem style={{ paddingTop: 2 }}>
                                <Typography
                                    color='text.primary'
                                    variant='body2'
                                >
                                    {totalBalance(balance.balance, chainInfo.config.currencies[0].coinDecimals)}
                                    &nbsp;{chainInfo.config.currencies[0].coinDenom}
                                </Typography>
                            </ListItem>
                            <ListItem style={{ justifyContent: 'center' }}>
                                <Button
                                    endIcon={<LogoutOutlinedIcon />}
                                    size='small'
                                    variant='outlined'
                                    style={{ textTransform: 'capitalize' }}
                                    disableElevation
                                    onClick={() => onDisconnectWallet()}
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
                                    onClick={() => onConnectWallet(selectedNetwork)}
                                >
                                    Connect Wallet
                                </Button>
                            </ListItem>
                        </>
                }


            </List>
            <Divider />
            <List component="nav">
                {
                    drawerListItems(location.pathname,
                        (path) => { onNavigate(path) }, selectedNetwork?.showAirdrop)
                }
            </List>
            <List
                style={{ marginTop: 'auto', flexDirection: 'row' }}
            >
                <ListItem
                    style={{ justifyContent: 'center' }}
                >
                    <Typography
                        color='text.secondary'
                        variant='caption'
                    >
                        Designed & Developed By
                    </Typography>
                </ListItem>
                <ListItem
                    style={{ justifyContent: 'center' }}
                >
                    <img
                        src='./logo-only.png'
                        width={25}
                        height={18}
                    />
                    &nbsp;
                    <Link
                        style={{ textDecoration: 'none' }}
                        target="_blank"
                        href='https://vitwit.com'
                    >
                        Vitwit.com
                    </Link>

                </ListItem>
            </List>
        </Drawer>
    );
}

AppDrawer.propTypes = {
    wallet: PropTypes.object.isRequired,
    onDisconnectWallet: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onConnectWallet: PropTypes.func.isRequired,
    selectedNetwork: PropTypes.object.isRequired,
    balance: PropTypes.object.isRequired,
    chainInfo: PropTypes.object.isRequired,
    onCopy: PropTypes.func.isRequired,
}