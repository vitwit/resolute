import React, { useEffect } from 'react';
import { getMainNetworks, getTestNetworks } from '../utils/networks';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import PropTypes from 'prop-types';
import DividerWithText from './DividerWithText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { shortenAddress } from '../utils/util';

export function CustomAppBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        if (selectedAuthz.granter.length === 0) {
        setAnchorEl(event.currentTarget);
        } else {
            alert("cannot switch to other network in authz mode")
        }
    };

    const selectedAuthz = useSelector((state) => state.authz.selected);

    useEffect(() => {
        document.getElementById("logo-chain-main").src = props.selectedNetwork.logos?.toolbar
    }, [props.selectedNetwork]);

    return (
        <AppBar position="absolute"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                mt: 0
            }}>
            {
                selectedAuthz.granter.length > 0 ?
                    <Toolbar
                    variant="dense"
                    sx={{
                        minHeight: 32,
                        backgroundImage: 'linear-gradient(to right, rgb(36 133 40), rgb(4 143 34), rgb(2 120 25), rgb(7 143 4), rgb(9 191 40))'
                    }}
                    >
                        <Typography
                            component="h5"
                            variant="body1"
                            color="inherit"
                            fontWeight={500}
                            noWrap
                            sx={{ flexGrow: 1 }}
                            align='left'
                        >
                            Granter mode: &nbsp;{shortenAddress(selectedAuthz.granter, 21)}
                        </Typography>
                        <Button
                            variant='text'
                            color='inherit'
                            sx={{
                                textTransform: 'none'
                            }}
                            startIcon={<CloseOutlinedIcon />}
                            onClick={() => {
                                props.onExit()
                            }}
                        >
                            Exit Authz
                        </Button>
                    </Toolbar>
                    :
                    <></>
            }
            <Toolbar>
                <img id='logo-chain-main' src="white-logo.png" style={{ maxWidth: 161, maxHeight: 45 }} />
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    align='left'
                >
                </Typography>
                <IconButton
                    aria-label='mode'
                    onClick={() => props.onModeChange()}
                >
                    {props.darkMode ? <LightModeOutlined /> : <DarkModeOutlined />}

                </IconButton>
                <Button
                    id="demo-positioned-button"
                    color='inherit'
                    endIcon={<ExpandMoreOutlinedIcon />}
                    aria-controls={anchorEl ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                    onClick={handleClick}
                >
                    {props.selectedNetwork.config?.chainName}
                </Button>
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
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
                        getMainNetworks().map((network, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setAnchorEl(null);
                                    props.onNetworkChange(network)
                                }
                                }
                            >
                                <ListItemIcon>
                                    <img src={network.logos.menu} />
                                </ListItemIcon>
                                <ListItemText>
                                    {network.config.chainName}
                                </ListItemText>
                            </MenuItem>
                        ))
                    }
                    {
                        getTestNetworks().length > 0 ?
                            <DividerWithText > Testnets </DividerWithText>
                            :
                            <></>
                    }
                    {
                        getTestNetworks().map((network, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setAnchorEl(null);
                                    props.onNetworkChange(network)
                                }
                                }
                            >
                                <ListItemIcon>
                                    <img src={network.logos?.menu} />
                                </ListItemIcon>
                                <ListItemText>
                                    {network.config?.chainName}
                                </ListItemText>
                            </MenuItem>
                        ))
                    }

                </Menu>
            </Toolbar>
        </AppBar>
    );

}

CustomAppBar.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    onModeChange: PropTypes.func.isRequired,
    selectedNetwork: PropTypes.object.isRequired,
    onNetworkChange: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
};