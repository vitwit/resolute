import React from "react";
import { Avatar, Dialog, DialogContent, DialogTitle, Grid, Paper, Typography } from "@mui/material";

export interface ConnectWalletDiaogProps {
  open: boolean;
  onClose: () => void;
  onWalletSelect: (name: string) => void;
}

export function ConnectWalletDialog(props: ConnectWalletDiaogProps) {
  const { onClose, onWalletSelect, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleOnWalletSelect = (name: string) => {
    onWalletSelect(name);
  };

  return (
    <Dialog onClose={handleClose} open={open}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          justifyContent: "center",
          display: "flex"
        }}
      >Connect Wallet</DialogTitle>
      <DialogContent
        sx={{
          p: 2,
        }}
      >
        <Grid container>
          <Grid item xs={6} md={6}
            sx={{
              justifyContent: "center",
              display: "flex"
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
              }}
              onClick={() => handleOnWalletSelect("keplr")}
            >
              <Avatar
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/keplr.svg"
              />
              <Typography
                variant="h6"
              >
                Keplr
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={6}
            sx={{
              justifyContent: "center",
              display: "flex"
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
              }}
              onClick={() => handleOnWalletSelect("leap")}
            >
              <Avatar
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/leap.png"
              />
              <Typography
                variant="h6"
              >
                Leap
              </Typography>
            </Paper>

          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}