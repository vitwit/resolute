import React from "react";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

export interface ConnectWalletDiaogProps {
  open: boolean;
  onClose: () => void;
  onWalletSelect: (name: string) => void;
  mode: "light" | "dark";
}

export function ConnectWalletDialog(props: ConnectWalletDiaogProps) {
  const { onClose, onWalletSelect, open, mode } = props;

  const handleClose = () => {
    onClose();
  };

  const handleOnWalletSelect = (name: string) => {
    onWalletSelect(name);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth
      sx={{
        p: 2
      }}
    >
      <DialogTitle
        sx={{
          justifyContent: "center",
          display: "flex",
        }}
        variant="h6"
      >
        Connect Wallet
      </DialogTitle>
      <DialogContent
        sx={{
          p: 3,
          mt: 2,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Paper
              elevation={mode === "light" ? 1 : 0}
              sx={{
                pt: 1,
                pb: 1,
                pl: 4,
                pr: 4,
                display: "flex",
                justifyContent: "center"
              }}
              onClick={() => handleOnWalletSelect("keplr")}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/keplr.svg"
              />
              <Typography
                variant="h6"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                &nbsp;Keplr Wallet&nbsp;
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              justifyContent: "center",
              display: "flex",
            }}
            mt={2}
          >
            <Paper
              elevation={mode === "light" ? 1 : 0}
              sx={{
                pt: 1,
                pb: 1,
                pl: 4,
                pr: 4,
                display: "flex",
                justifyContent: "center"
              }}
              onClick={() => handleOnWalletSelect("leap")}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/leap.png"
              />
              <Typography
                variant="h6"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                &nbsp;Leap Wallet&nbsp;&nbsp;
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              justifyContent: "center",
              display: "flex",
              mt: 2,
            }}
          >
            <Paper
              elevation={mode === "light" ? 1 : 0}
              sx={{
                pt: 1,
                pb: 1,
                pl: 4,
                pr: 4,
                display: "flex",
                justifyContent: "center"
              }}
              onClick={() => handleOnWalletSelect("cosmostation")}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/cosmostation.png"
              />
              <Typography
                variant="h6"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                &nbsp;Cosmostation
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
