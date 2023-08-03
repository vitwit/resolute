import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ConnectWalletDialog } from "./wallet/ConnectWallet";
import { useDispatch } from "react-redux";
import { connectWallet } from "./CustomAppBar";
import { useTheme } from "@emotion/react";

export default function ConnectWallet() {
  const [showSelectWallet, setShowSelectWallet] = useState(false);
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        fontWeight={600}
        color="text.primary"
      >
        Wallet not connected
      </Typography>
      <Button
        onClick={() => {
          setShowSelectWallet(!showSelectWallet);
        }}
        sx={{
          textTransform: "none",
        }}
        variant="contained"
        disableElevation
      >
        Connect wallet
      </Button>
      <ConnectWalletDialog
        open={showSelectWallet}
        onClose={() => setShowSelectWallet(false)}
        onWalletSelect={(wallet) => {
          connectWallet(wallet, dispatch);
          setShowSelectWallet(false);
        }}
      />
    </Box>
  );
}
