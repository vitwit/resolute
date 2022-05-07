import React from 'react';
import { getNetworks } from '../utils/networks';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button'

export function CustomAppBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(false);
    const menuOpen = anchorEl;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
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
                    {props.selectedNetwork.displayName}
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
                                onClick={() => {
                                    setAnchorEl(false);
                                    props.onNetworkChange(network)}
                                }
                            >
                                {network.displayName}
                            </MenuItem>
                        ))
                    }
                </Menu>
            </Toolbar>
        </AppBar>
    );

}