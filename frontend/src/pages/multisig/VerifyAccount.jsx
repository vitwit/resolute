import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { verifyAccount } from "../../features/multisig/multisigSlice";

const VerifyAccount = ({ chainID, walletAddress }) => {
  const dispatch = useDispatch();
  const dispatchVerifyAccount = (chainID, walletAddress) => {
    dispatch(
      verifyAccount({
        chainID: chainID,
        address: walletAddress,
      })
    );
  };
  return (
    <Box sx={{ p: 4, my: 2 }}>
      <Typography>Please verify your account ownership to proceed.</Typography>
      <Button
        sx={{ mt: 2 }}
        size="small"
        variant="contained"
        disableElevation
        onClick={() => {
          dispatchVerifyAccount(chainID, walletAddress);
        }}
      >
        Verify
      </Button>
    </Box>
  );
};

export default VerifyAccount;
