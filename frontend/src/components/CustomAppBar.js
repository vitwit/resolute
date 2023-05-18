import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { setAuthzMode } from "../features/common/commonSlice";
import { Switch } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { Button, Box } from "@mui/material";
import { setSelectedNetwork } from "../features/common/commonSlice";
import { getGrantsToMe } from "../features/authz/authzSlice";

export function CustomAppBar(props) {
  const dispatch = useDispatch();

  const networks = useSelector((state) => state.wallet.networks);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const chainIDs = Object.keys(networks);

  const selectedAuthz = useSelector((state) => state.authz.selected);
  const selectNetwork = useSelector((state) => state.common.selectedNetwork.chainName)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [checked, setChecked] = useState(false);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
    if (checked) {
      dispatch(setAuthzMode(false));
    } else {
      dispatch(setAuthzMode(true));
    }
  };

  const handleClick = (event) => {
    if (selectedAuthz.granter.length === 0) {
      setAnchorEl(event.currentTarget);
    } else {
      alert("cannot switch to other network in authz mode");
    }
  };

  const getVoteAuthz = (isAuthzMode) => {
    if (isAuthzMode) {
      Object.keys(networks).map((key, _) => {
        const network = networks[key];
        dispatch(getGrantsToMe({
          baseURL: network.network?.config?.rest,
          grantee: network.walletInfo?.bech32Address,
          chainID: network.network?.config?.chainId
        }))
      })
    }
  }

  return (
    <AppBar
      position="absolute"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        mt: 0,
      }}
    >
      <Toolbar>
        <img
          id="logo-chain-main"
          alt="app-logo"
          src="https://raw.githubusercontent.com/vitwit/chain-registry/08711dbf4cbc12d37618cecd290ad756c07d538b/cosmoshub/images/cosmoshub-logo.png"
          style={{ maxWidth: 161, maxHeight: 45 }}
        />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
          align="left"
        ></Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mx: "10px",
          }}
        >
          <Typography sx={{ fontWeight: "500" }}>Authz mode</Typography>
          <Switch checked={checked} onChange={switchHandler} color="info" />
        </Box>

        <IconButton aria-label="mode" onClick={() => props.onModeChange()}>
          {props.darkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
        <Button
          id="demo-positioned-button"
          color="inherit"
          endIcon={<ExpandMoreOutlinedIcon />}
          aria-controls={anchorEl ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? "true" : undefined}
          onClick={handleClick}
          sx={{ width: { lg: "10%" } }}
        >
          {selectNetwork}
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {chainIDs.map(chain => (
            <MenuItem
              key={chain}
              onClick={() => {
                getVoteAuthz(isAuthzMode);
                setAnchorEl(null);
                dispatch(setSelectedNetwork({
                  chainName: networks[chain].network.config.chainName,
                  chainID: networks[chain].network.config.chainId
                }));
              }}
            >
              <ListItemText>{networks[chain].network.config.chainName}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

CustomAppBar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onModeChange: PropTypes.func.isRequired,
};
