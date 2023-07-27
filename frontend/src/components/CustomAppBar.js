import React, { useEffect, useState } from "react";
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
import Button from "@mui/material/Button";
import { getGrantsToMe } from "../features/authz/authzSlice";
import { useNavigate } from "react-router-dom";
import { resetTabs, resetTabResetStatus } from "../features/authz/authzSlice";
import { connectWalletV1, resetWallet } from "../features/wallet/walletSlice";
import { networks as allNetworks } from "../utils/chainsInfo";
import { KEY_WALLET_NAME, removeAllFeegrants } from "../utils/localStorage";
import { resetFeegrantState } from "../features/feegrant/feegrantSlice";
import { ConnectWalletDialog } from "./wallet/ConnectWallet";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export function CustomAppBar(props) {
  const tabResetStatus = useSelector((state) => state.authz.tabResetStatus);
  const dispatch = useDispatch();

  const networks = useSelector((state) => state.wallet.networks);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const isWalletConnected = useSelector((state) => state.wallet.connected);

  const [showSelectWallet, setShowSelectWallet] = useState(false);

  const connectWallet = (walletName) => {
    if (walletName === "keplr") {
      window.wallet = window.keplr;
      setTimeout(() => {
        dispatch(
          connectWalletV1({
            mainnets: allNetworks,
            testnets: [],
            walletName: "keplr",
          })
        );
        removeAllFeegrants();
        dispatch(resetFeegrantState());
        localStorage.setItem(KEY_WALLET_NAME, "keplr");
      }, 1000);
    } else if (walletName === "leap") {
      window.wallet = window.leap;
      setTimeout(() => {
        dispatch(
          connectWalletV1({
            mainnets: allNetworks,
            testnets: [],
            walletName: "leap",
          })
        );
        removeAllFeegrants();
        dispatch(resetFeegrantState());
        localStorage.setItem(KEY_WALLET_NAME, "leap");
      }, 1000);
    }
  };

  const switchHandler = (event) => {
    dispatch(setAuthzMode(event.target.checked));
  };

  useEffect(() => {
    if (tabResetStatus) {
      dispatch(resetTabResetStatus());
      Object.keys(networks).forEach((key) => {
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

  const handleDisconnectWallet = () => {
    removeAllFeegrants();
    dispatch(resetFeegrantState());
    localStorage.removeItem(KEY_WALLET_NAME);
    dispatch(resetWallet());
  };

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

        {isWalletConnected ? (
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
        ) : null}
        
        {!isWalletConnected ? (
          <Button
            color="inherit"
            onClick={() => {
              setShowSelectWallet(!showSelectWallet);
            }}
            sx={{
              textTransform: "none",
            }}
          >
            Connect wallet
          </Button>
        ) : (
          <Button
            color="inherit"
            sx={{
              textTransform: "none",
            }}
            endIcon={<LogoutOutlinedIcon />}
            onClick={() => {
              handleDisconnectWallet();
            }}
          >
            Disconnect
          </Button>
        )}
      </Toolbar>

      <ConnectWalletDialog
        open={showSelectWallet}
        onClose={() => setShowSelectWallet(false)}
        onWalletSelect={(wallet) => {
          connectWallet(wallet);
          setShowSelectWallet(false);
        }}
      />
    </AppBar>
  );
}

CustomAppBar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onModeChange: PropTypes.func.isRequired,
};
