import React from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import PropTypes from "prop-types";

export function CustomAppBar(props) {

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
      </Toolbar>
    </AppBar>
  );
}

CustomAppBar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onModeChange: PropTypes.func.isRequired,
};
