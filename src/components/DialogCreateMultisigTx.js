import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getBalance } from "../features/bank/bankSlice";
import { getDelegations, getValidators } from "../features/staking/stakeSlice";
import Delegation_Form from "./multisig/Delegation_Form";
import ReDelegation_Form from "./multisig/ReDelegation_Form";
import SendForm from "./multisig/SendForm";
import UnDelegation_Form from "./multisig/UnDelegation_Form";
import PropTypes from "prop-types";

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, ml: 1 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const DialogCreateMultisigTx = (props) => {
  const [txType, setTxType] = useState("");
  const { handleClose, open } = props;
  const dispatch = useDispatch();

  const handleTypeChange = (event) => {
    setTxType(event.target.value);
  };

  const createTxnRes = useSelector((state) => state.multisig.createTxnRes);

  useEffect(() => {
    if (createTxnRes?.status === "done") handleClose();
  }, [createTxnRes]);

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, address, connected } = wallet;

  useEffect(() => {
    if (connected) {
      dispatch(
        getBalance({
          baseURL: chainInfo.config.rest,
          address: address,
          denom: chainInfo?.config?.currencies[0].coinMinimalDenom,
        })
      );

      dispatch(
        getValidators({
          baseURL: chainInfo.config.rest,
          status: null,
        })
      );

      dispatch(
        getDelegations({
          baseURL: chainInfo.config.rest,
          address: address,
        })
      );
    }
  }, [chainInfo]);

  return (
    <Dialog fullWidth maxWidth={"xs"} onClose={handleClose} open={open}>
      <BootstrapDialogTitle onClose={handleClose}>
        Create Transaction
      </BootstrapDialogTitle>
      {/* <DialogTitle
        variant="h6"
        fontWeight={600}
        sx={{
          textAlign: "center",
        }}
      >
        Create Transaction
      </DialogTitle> */}
      <DialogContent>
        <Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl
              fullWidth
              sx={{
                mt: 1,
              }}
            >
              <InputLabel id="demo-simple-select-label">
                Select Transaction
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={txType}
                label="Select Transaction"
                onChange={handleTypeChange}
              >
                <MenuItem value={"send"}>Send</MenuItem>
                <MenuItem value={"delegate"}>Delegate</MenuItem>
                <MenuItem value={"redelegate"}>Redelegate</MenuItem>
                <MenuItem value={"undelegate"}>Undelegate</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {txType === "send" ? <SendForm chainInfo={chainInfo} /> : null}

          {txType === "delegate" ? (
            <Delegation_Form chainInfo={chainInfo} />
          ) : null}

          {txType === "redelegate" ? (
            <ReDelegation_Form chainInfo={chainInfo} />
          ) : null}

          {txType === "undelegate" ? (
            <UnDelegation_Form chainInfo={chainInfo} />
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogCreateMultisigTx);
