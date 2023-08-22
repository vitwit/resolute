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
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          justifyContent: "center",
          display: "flex",
        }}
        variant="h5"
      >
        Connect Wallet
      </DialogTitle>
      <DialogContent
        sx={{
          p: 2,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={6}
            md={6}
            sx={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: "36%",
              }}
              onClick={() => handleOnWalletSelect("keplr")}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/keplr.svg"
              />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  mt: 1,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                &nbsp;Keplr
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={6}
            md={6}
            sx={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: "36%",
              }}
              onClick={() => handleOnWalletSelect("leap")}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/leap.png"
              />
              <Typography
                fontWeight={600}
                variant="h6"
                sx={{
                  mt: 1,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                &nbsp;Leap
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={6}
            md={6}
            sx={{
              justifyContent: "center",
              display: "flex",
              mt: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: "36%",
                wordWrap: "break-word", // Allow the text to wrap within the specified width
              }}
              onClick={() => handleOnWalletSelect("cosmostation")}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                src="https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/cosmostation.png"
              />
              <Typography
                fontWeight={600}
                variant="h6"
                sx={{
                  mt: 1,
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
