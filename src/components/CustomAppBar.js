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

export function CustomAppBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        document.getElementById("logo-chain-main").src = props.selectedNetwork.logoName
    }, [props.selectedNetwork]);

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <img id='logo-chain-main' src="white-logo.png" />
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
                    {props.selectedNetwork.displayName}
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
                                    <img src={network?.src} />
                                </ListItemIcon>
                                <ListItemText>
                                    {network.displayName}
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
                                    <img src={network?.src} />
                                </ListItemIcon>
                                <ListItemText>
                                    {network.displayName}
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
};