import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { setAuthzMode } from "../features/common/commonSlice";
import { FormControlLabel, Switch } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Button from "@mui/material/Button";
import { setSelectedNetwork } from "../features/common/commonSlice";
import { getGrantsToMe } from "../features/authz/authzSlice";
import { useNavigate } from "react-router-dom";
import { resetTabs, resetTabResetStatus } from "../features/authz/authzSlice";

export function CustomAppBar(props) {
  const tabResetStatus = useSelector((state) => state.authz.tabResetStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const networks = useSelector((state) => state.wallet.networks);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const chainIDs = Object.keys(networks);

  const selectedAuthz = useSelector((state) => state.authz.selected);
  const selectNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [anchorEl, setAnchorEl] = React.useState(null);

  const switchHandler = (event) => {
    dispatch(setAuthzMode(event.target.checked));
  };

  const handleClick = (event) => {
    if (selectedAuthz.granter.length === 0) {
      setAnchorEl(event.currentTarget);
    } else {
      alert("cannot switch to other network in authz mode");
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (tabResetStatus) {
      dispatch(resetTabResetStatus());
      Object.keys(networks).map((key, _) => {
        const network = networks[key];
        dispatch(
          getGrantsToMe({
            baseURL: network.network?.config?.rest,
            grantee: network.walletInfo?.bech32Address,
            chainID: network.network?.config?.chainId,
            changeAuthzTab: true,
          })
        );
      });
    }
  }, [tabResetStatus]);

  useEffect(() => {
    if (isAuthzMode) {
      dispatch(resetTabs());
    }
  }, [isAuthzMode]);

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

        <IconButton aria-label="mode" onClick={() => props.onModeChange()}>
          {props.darkMode ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>

        <FormControlLabel
          label="Authz mode"
          control={
            <Switch
              checked={isAuthzMode}
              onChange={switchHandler}
              color="secondary"
            />
          }
        ></FormControlLabel>
        <Button
          id="demo-positioned-button"
          color="inherit"
          endIcon={<ExpandMoreOutlinedIcon />}
          aria-controls={anchorEl ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? "true" : undefined}
          onClick={handleClick}
        >
          {selectNetwork || "Select Network"}
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
          {chainIDs.map((chain) => (
            <MenuItem
              key={chain}
              onClick={() => {
                setAnchorEl(null);
                dispatch(
                  setSelectedNetwork({
                    chainName: networks[chain].network.config.chainName,
                    chainID: networks[chain].network.config.chainId,
                  })
                );
                navigateTo("/");
              }}
            >
              <ListItemText>
                {networks[chain].network.config.chainName}
              </ListItemText>
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
