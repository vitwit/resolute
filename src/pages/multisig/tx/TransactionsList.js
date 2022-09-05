import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PropTypes from "prop-types";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  CircularProgress,
  Button,
  Typography,
  Link,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTxn,
  multisigByAddress,
  getSigns,
  getTxns,
  resetDeleteTxnState,
  resetCreateTxnState,
  resetUpdateTxnState,
  resetSignTxnState,
} from "../../../features/multisig/multisigSlice";
import BroadcastTx from "../BroadcastTx";
import SignTxn from "../SignTxn";
import { useParams } from "react-router-dom";
import { shortenAddress } from "../../../utils/util";
import { parseTokens } from "../../../utils/denom";
import { setError } from "../../../features/common/commonSlice";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/CustomTable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

const mapTxns = {
  "/cosmos.staking.v1beta1.MsgDelegate": "Delegate",
  "/cosmos.bank.v1beta1.MsgSend": "Send",
  "/cosmos.staking.v1beta1.MsgBeginRedelegate": "Re-Delegate",
  "/cosmos.staking.v1beta1.MsgUndelegate": "Un-Delegate",
  Msg: "Tx Msg",
};

const getTxStatusComponent = (status, onShowError) => {
  return (
    <>
      {status === "DONE" ? (
        <Chip size="small" label="Success" color="success" variant="outlined" />
      ) : (
        <>
          <Chip size="small" label="Failed" color="error" variant="outlined" />
          <Typography
            color="primary"
            variant="body2"
            sx={{
              textDecoration: "underline",
              mt: 1,
              cursor: "pointer",
            }}
            onClick={() => onShowError()}
          >
            Error message
          </Typography>
        </>
      )}
    </>
  );
};

const TableRowComponent = ({ tx, type, index, onShowError }) => {
  const { address } = useParams();
  const walletAddress = useSelector((state) => state.wallet.address);
  const chainInfo = useSelector((state) => state.wallet.chainInfo);

  const multisigAccountDetails = useSelector(
    (state) => state.multisig.multisigAccount
  );
  const multisigAccount = multisigAccountDetails?.data?.data || {};

  const threshold = Number(multisigAccount?.pubkeyJSON?.value?.threshold || 0);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const getAllSignatures = () => {
    let txId = tx?._id;
    dispatch(getSigns({ address: multisigAccount?.address, txId }));
  };

  const getMultisignatureAcc = () => {
    dispatch(multisigByAddress(address || ""));
  };

  useEffect(() => {
    getAllSignatures();
    getMultisignatureAcc();
  }, []);

  const isWalletSigned = () => {
    let signs = tx?.signatures || [];
    let existedAddress = signs.filter((k) => k.address === walletAddress);

    if (existedAddress && existedAddress?.length) return true;
    else return false;
  };

  const isReadyToBroadcast = () => {
    let signs = tx?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };

  const parseMultisigTxn = (tx) => {
    let tx1 = JSON.parse(JSON.stringify(tx));
    delete tx1?.timestamp;
    delete tx1?.status;
    delete tx1?._id;
    delete tx1?.hash;
    delete tx1?.address;
    delete tx1?.chainid;
    delete tx1?.errorMsg;

    const signatures = tx1?.signatures;

    const signaturesOnly = [];
    if (signatures && signatures?.length > 0) {
      for (let i = 0; i < signatures?.length; i++) {
        signaturesOnly.push(signatures[i]?.signature);
      }
    }
    delete tx1.signatures;
    tx1.signatures = signaturesOnly;
    return tx1;
  };

  const displayDenom = (amountObj) => {
    if (Array.isArray(amountObj)) {
      return parseTokens(
        amountObj,
        chainInfo?.config?.currencies[0].coinDenom,
        chainInfo?.config?.currencies[0].coinDecimals
      );
    } else {
      return parseTokens(
        [amountObj],
        chainInfo?.config?.currencies[0].coinDenom,
        chainInfo?.config?.currencies[0].coinDecimals
      );
    }
  };

  return (
    <>
      <StyledTableRow>
        <StyledTableCell
          sx={{
            maxWidth: 250,
          }}
        >
          {tx?.msgs.map((msg, index) => (
            <Box component="div" id={index}>
              {msg.typeUrl === "/cosmos.bank.v1beta1.MsgSend" ? (
                <p>
                  {mapTxns[msg?.typeUrl]} &nbsp;
                  <strong>{displayDenom(msg?.value?.amount)}</strong>
                  &nbsp;To&nbsp;{" "}
                  <strong> {shortenAddress(msg?.value?.toAddress, 27)}</strong>
                </p>
              ) : null}

              {msg.typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" ? (
                <p>
                  {mapTxns[msg?.typeUrl]}{" "}
                  <strong>{displayDenom(msg?.value?.amount)}</strong>
                  &nbsp; To &nbsp;
                  <strong>
                    {shortenAddress(msg?.value?.validatorAddress, 27)}
                  </strong>
                </p>
              ) : null}

              {msg.typeUrl === "/cosmos.staking.v1beta1.MsgUndelegate" ? (
                <p>
                  {mapTxns[msg?.typeUrl]}{" "}
                  <strong>{displayDenom(msg?.value?.amount)}</strong>
                  &nbsp; From &nbsp;
                  <strong>
                    {shortenAddress(msg?.value?.validatorAddress, 27)}
                  </strong>
                </p>
              ) : null}

              {msg.typeUrl === "/cosmos.staking.v1beta1.MsgBeginRedelegate" ? (
                <p>
                  {mapTxns[msg?.typeUrl]} &nbsp;
                  <strong>{displayDenom(msg?.value?.amount)}</strong>
                  &nbsp;
                  <br />
                  From &nbsp;
                  <strong>
                    {shortenAddress(msg?.value?.validatorSrcAddress, 27)}
                  </strong>
                  &nbsp; To &nbsp;
                  <strong>
                    {shortenAddress(msg?.value?.validatorDstAddress, 27)}
                  </strong>
                </p>
              ) : null}
            </Box>
          ))}
        </StyledTableCell>
        <StyledTableCell>
          {tx?.signatures?.length || 0}/{threshold}
        </StyledTableCell>
        <StyledTableCell align="left">
          {(tx?.signatures?.length || 0) >= threshold
            ? tx?.status === "DONE" || tx?.status === "FAILED"
              ? getTxStatusComponent(tx?.status, onShowError)
              : "Waiting for brodcast"
            : !isWalletSigned()
            ? "Waiting for your sign"
            : "Waiting for others to sign"}
        </StyledTableCell>
        {type === "history" ? (
          <StyledTableCell align="center">
            {tx?.hash && tx?.hash.length > 0 ? (
              <Link
                target="_blank"
                href={`${chainInfo?.explorerTxHashEndpoint}${tx?.hash}`}
                color="inherit"
              >
                Transaction info
              </Link>
            ) : (
              "-"
            )}
          </StyledTableCell>
        ) : null}
        {type === "active" ? (
          <StyledTableCell align="center">
            {isReadyToBroadcast() ? (
              tx?.status === "DONE" || tx?.status === "FAILED" ? (
                tx?.status
              ) : (
                <BroadcastTx
                  tx={tx}
                  signatures={tx?.signatures}
                  multisigAccount={multisigAccount}
                />
              )
            ) : (
              <SignTxn
                address={multisigAccount?.address}
                signatures={tx?.signatures}
                txId={tx?._id}
                unSignedTxn={tx}
              />
            )}
          </StyledTableCell>
        ) : null}
        <StyledTableCell
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          align="center"
        >
          <Button
            variant="text"
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDown />}
            sx={{
              mt: 2,
              mb: 2,
              textTransform: "none",
            }}
          >
            Raw
          </Button>

          <IconButton
            aria-label="delete txn"
            color="error"
            sx={{
              mt: 2,
              mb: 2,
              ml: 1,
            }}
            onClick={() => {
              dispatch(deleteTxn(tx?._id));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableRow
          sx={{
            width: "100%",
          }}
        >
          <TableCell style={{ width: "50%", paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} unmountOnExit>
              <pre
                style={{
                  width: 100,
                  outline: "none",
                }}
              >
                {JSON.stringify(parseMultisigTxn(tx), undefined, 2)}
              </pre>
            </Collapse>
          </TableCell>
        </TableRow>
      </TableRow>
    </>
  );
};

export default function Transactions(props) {
  const dispatch = useDispatch();
  const txns = useSelector((state) => state.multisig.txns?.data?.data || []);
  const createTxRes = useSelector((state) => state.multisig.createTxnRes);
  const [isHistory, setIsHistory] = useState(false);

  const createSignRes = useSelector((state) => state.multisig.createSignRes);
  const updateTxnStatus = useSelector((state) => state.multisig.updateTxn);
  const deleteTxnStatus = useSelector((state) => state.multisig.deleteTxnRes);

  const getAllTxns = (status) => {
    dispatch(
      getTxns({
        address: props.address,
        status: status,
      })
    );
  };

  useEffect(() => {
    if (deleteTxnStatus.status === "idle") {
      dispatch(
        setError({
          type: "success",
          message: "Successfully deleted",
        })
      );
      getAllTxns(isHistory ? "history" : "current");
    } else if (deleteTxnStatus.status === "error") {
      dispatch(
        setError({
          type: "error",
          message: deleteTxnStatus.error,
        })
      );
    }
  }, [deleteTxnStatus]);

  useEffect(() => {
    if (updateTxnStatus.status === "idle") {
      getAllTxns(isHistory ? "history" : "current");
    }
  }, [updateTxnStatus]);

  useEffect(() => {
    if (createSignRes.status === "idle") {
      dispatch(setError({ type: "success", message: "Successfully signed" }));
      getAllTxns(isHistory ? "history" : "current");
    } else if (createSignRes.status === "error") {
      dispatch(
        setError({
          type: "error",
          message: "Error while signing the transaction",
        })
      );
    }
  }, [createSignRes]);

  useEffect(() => {
    if (createTxRes.status === "idle") {
      dispatch(setError({ type: "success", message: "Successfully created" }));
      getAllTxns(isHistory ? "history" : "current");
    } else if (createTxRes.status === "rejected") {
      dispatch(setError({ type: "error", message: createTxRes.error }));
    }
  }, [createTxRes]);

  const walletConnected = useSelector((state) => state.wallet.connected);
  useEffect(() => {
    if (walletConnected) {
      getAllTxns(isHistory ? "history" : "current");
      return () => {
        dispatch(resetDeleteTxnState());
        dispatch(resetCreateTxnState());
        dispatch(resetUpdateTxnState());
        dispatch(resetSignTxnState());
      };
    }
  }, [walletConnected]);

  const [errorMsg, setErrorMsg] = useState("");
  const [openError, setOpenError] = useState(false);

  return (
    <Box>
      {txns?.status !== "pending" && !txns?.length ? (
        <Typography variant="body1" color="error" fontWeight={500}>
          No transactions found
        </Typography>
      ) : (
        ""
      )}
      {txns?.status === "pending" ? <CircularProgress size={40} /> : null}
      <Box style={{ display: "flex" }}>
        <ButtonGroup
          disableElevation
          variant="outlined"
          aria-label="outlined button group"
        >
          <Button
            variant={isHistory ? "outlined" : "contained"}
            onClick={() => {
              setIsHistory(false);
              dispatch(
                getTxns({
                  address: props.address,
                  status: "current",
                })
              );
            }}
          >
            Active
          </Button>
          <Button
            variant={isHistory ? "contained" : "outlined"}
            onClick={() => {
              setIsHistory(true);
              dispatch(
                getTxns({
                  address: props.address,
                  status: "history",
                })
              );
            }}
          >
            Completed
          </Button>
        </ButtonGroup>
      </Box>

      <TableContainer
        elevation={0}
        sx={{
          mt: 1,
        }}
      >
        <Table
          sx={{ minWidth: 500 }}
          size="small"
          aria-label="collapsible table"
        >
          {isHistory ? (
            <>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Messages</StyledTableCell>
                  <StyledTableCell>No of Signatures</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="center">
                    Transaction Url
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {txns.map((row, index) => (
                  <TableRowComponent
                    key={index}
                    tx={row}
                    type="history"
                    onShowError={() => {
                      setErrorMsg(row?.errorMsg);
                      setOpenError(true);
                    }}
                  />
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell
                    sx={{
                      maxWidth: 220,
                    }}
                  >
                    Messages
                  </StyledTableCell>
                  <StyledTableCell>No of Signatures</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {txns.map((row, index) => (
                  <TableRowComponent key={index} tx={row} type="active" />
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>

      {openError ? (
        <Dialog
          open={openError}
          onClose={() => {
            setOpenError(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              variant="body1"
              color="text.primary"
            >
              {errorMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenError(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </Box>
  );
}

Transactions.propTypes = {
  address: PropTypes.string.isRequired,
};
