import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedNetwork, setSelectedNetworkLocal } from "../features/common/commonSlice";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";

const chainItemStyle = {
  display: "flex",
  p: 1,
  borderRadius: 1,
  alignItems: "center",
  "&:hover": {
    cursor: "pointer",
  },
};

const dialogTitleStyle = {
  pl: 2,
  pb: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const DialogSelectNetwork = (props) => {
  const { open, dialogCloseHandle, authzModeAlert } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const networks = useSelector((state) => state.wallet.networks);
  const isAuthzMode = useSelector((state) => state.common.authzMode);

  const chainIDs = Object.keys(networks);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Dialog open={open} onClose={dialogCloseHandle}>
        <DialogTitle sx={dialogTitleStyle}>
          <Typography>Select Network</Typography>
          <CloseIcon
            sx={{ fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              dialogCloseHandle();
            }}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            pb: 1,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Grid container rowSpacing={3} columnSpacing={3}>
              {chainIDs.map((chain) => (
                <Grid
                  item
                  md={4}
                  xs={6}
                  onClick={() => {
                    if (isAuthzMode) {
                      authzModeAlert();
                    } else {
                      dialogCloseHandle();
                      dispatch(
                        setSelectedNetwork({
                          chainName: networks[chain].network.config.chainName,
                          chainID: networks[chain].network.config.chainId,
                        })
                      );
                      dispatch(
                        setSelectedNetworkLocal({
                          chainName: networks[chain].network.config.chainName,
                        })
                      );
                      navigateTo(
                        `${networks[
                          chain
                        ].network.config.chainName.toLowerCase()}/overview`
                      );
                    }
                  }}
                >
                  <ChainItem
                    chainName={networks[chain].network.config.chainName}
                    chainLogo={networks[chain].network.logos.menu}
                    chainID={chain}
                  />
                </Grid>
              ))}
              <Grid
                item
                md={4}
                xs={2}
                onClick={() => {
                  if (isAuthzMode) {
                    authzModeAlert();
                  } else {
                    dialogCloseHandle();
                    dispatch(
                      setSelectedNetwork({
                        chainName: "",
                      })
                    );
                    navigateTo("/");
                  }
                }}
              >
                <ChainItem
                  chainName={"All Networks"}
                  chainID={" "}
                  chainLogo={" "}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogSelectNetwork;

const ChainItem = (props) => {
  const { chainName, chainLogo, chainID } = props;
  const theme = useTheme();
  return (
    <Box
      sx={chainItemStyle}
      backgroundColor={theme.palette?.mode === "light" ? "#f1f1f1" : "#474747"}
      height={chainName === "All Networks" ? "39px" : null}
    >
      <Avatar src={chainLogo} sx={{ width: 28, height: 28 }} />
      <Typography sx={{ ml: 1 }}>
        <Typography>{chainName}</Typography>
        <Typography
          sx={{ fontSize: 10 }}
          color={theme.palette?.mode === "light" ? "#767676" : "#cbcbcb"}
        >
          {chainID}
        </Typography>
      </Typography>
    </Box>
  );
};

DialogSelectNetwork.propTypes = {
  open: PropTypes.bool.isRequired,
  dialogCloseHandle: PropTypes.func.isRequired,
};