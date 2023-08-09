import React, { useEffect, useState } from "react";
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
  Paper,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import { Box } from "@mui/system";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTxn,
  getTxns,
  resetDeleteTxnState,
  resetCreateTxnState,
  resetUpdateTxnState,
  resetSignTxnState,
} from "../../../features/multisig/multisigSlice";
import BroadcastTx from "../BroadcastTx";
import SignTxn from "../SignTxn";
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
import {
  RenderSendMessage,
  RenderDelegateMessage,
  RenderReDelegateMessage,
  RenderUnDelegateMessage,
} from "./PageCreateTx";
import {
  DELEGATE_TYPE_URL,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from "./utils";
import { useParams } from "react-router-dom";

const mapTxns = {
  "/cosmos.staking.v1beta1.MsgDelegate": "Delegate",
  "/cosmos.bank.v1beta1.MsgSend": "Send",
  "/cosmos.staking.v1beta1.MsgBeginRedelegate": "ReDelegate",
  "/cosmos.staking.v1beta1.MsgUndelegate": "UnDelegate",
  Msg: "Tx Msg",
};

const DialogMultisigMessages = (props) => {
  const renderMessage = (msg, index, currency, onDelete) => {
    switch (msg.typeUrl) {
      case SEND_TYPE_URL:
        return RenderSendMessage(msg, index, currency, onDelete);
      case DELEGATE_TYPE_URL:
        return RenderDelegateMessage(msg, index, currency, onDelete);
      case UNDELEGATE_TYPE_URL:
        return RenderUnDelegateMessage(msg, index, currency, onDelete);
      case REDELEGATE_TYPE_URL:
        return RenderReDelegateMessage(msg, index, currency, onDelete);
      default:
        return "";
    }
  };

  return (
    <Dialog onClose={(e) => props.onClose(e)} open={props.open}>
      <DialogTitle>Messages</DialogTitle>
      <DialogContent>
        <Paper
          elevation={0}
          sx={{
            p: 2,
          }}
        >
          {props.msgs.map((row, index) => {
            return (
              <Box component="div" key={index}>
                {renderMessage(row, index, props.currency, null)}
              </Box>
            );
          })}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            props.onClose();
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogMultisigMessages.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  msgs: PropTypes.array.isRequired,
  currency: PropTypes.object.isRequired,
};

const getTxStatusComponent = (status, onShowError) => {
  return (
    <>
      {status === "SUCCESS" ? (
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

const TableRowComponent = (props) => {
  const {
    tx,
    type,
    onShowError,
    onShowMoreTxns,
    multisigAccount,
    membersCount,
  } = props;
  const { networkName } = useParams();

  const threshold = multisigAccount?.account?.threshold || 0;

  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const walletAddress =
    networks[nameToChainIDs[networkName]]?.walletInfo?.bech32Address;
  const chainInfo = networks[nameToChainIDs[networkName]]?.network;

  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const isWalletSigned = () => {
    let signs = tx?.signatures || [];
    let existedAddress = signs.filter((k) => k.address === walletAddress);

    if (existedAddress && existedAddress?.length) return true;
    else return false;
  };

  const isReadyToBroadcast = () => {
    let signs = tx?.signatures || [];
    if (signs?.length >= multisigAccount?.account?.threshold) return true;
    else return false;
  };

  const parseMultisigTxn = (tx) => {
    let tx1 = JSON.parse(JSON.stringify(tx));
    delete tx1?.created_at;
    delete tx1?.last_updated;
    delete tx1?.status;
    delete tx1?.id;
    delete tx1?.hash;
    delete tx1?.multisig_address;
    delete tx1?.chainid;
    delete tx1?.err_msg;

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
        <StyledTableCell>
          {tx?.messages?.length === 0 ? (
            <Typography>-</Typography>
          ) : (
            <Box component="div">
              {tx?.messages[0].typeUrl === "/cosmos.bank.v1beta1.MsgSend" ? (
                <p>
                  {mapTxns[tx?.messages[0]?.typeUrl]} &nbsp;
                  <strong>
                    {displayDenom(tx?.messages[0]?.value?.amount)}
                  </strong>
                  &nbsp;To&nbsp;{" "}
                  <strong>
                    {" "}
                    {shortenAddress(tx?.messages[0]?.value?.toAddress, 27)}
                  </strong>
                </p>
              ) : null}

              {tx?.messages[0].typeUrl ===
              "/cosmos.staking.v1beta1.MsgDelegate" ? (
                <p>
                  {mapTxns[tx?.messages[0]?.typeUrl]}{" "}
                  <strong>
                    {displayDenom(tx?.messages[0]?.value?.amount)}
                  </strong>
                  &nbsp; To &nbsp;
                  <strong>
                    {shortenAddress(
                      tx?.messages[0]?.value?.validatorAddress,
                      27
                    )}
                  </strong>
                </p>
              ) : null}

              {tx?.messages[0].typeUrl ===
              "/cosmos.staking.v1beta1.MsgUndelegate" ? (
                <p>
                  {mapTxns[tx?.messages[0]?.typeUrl]}{" "}
                  <strong>
                    {displayDenom(tx?.messages[0]?.value?.amount)}
                  </strong>
                  &nbsp; From &nbsp;
                  <strong>
                    {shortenAddress(
                      tx?.messages[0]?.value?.validatorAddress,
                      27
                    )}
                  </strong>
                </p>
              ) : null}

              {tx?.messages[0].typeUrl ===
              "/cosmos.staking.v1beta1.MsgBeginRedelegate" ? (
                <p>
                  {mapTxns[tx?.messages[0]?.typeUrl]} &nbsp;
                  <strong>
                    {displayDenom(tx?.messages[0]?.value?.amount)}
                  </strong>
                  &nbsp;
                  <br />
                  From &nbsp;
                  <strong>
                    {shortenAddress(
                      tx?.messages[0]?.value?.validatorSrcAddress,
                      27
                    )}
                  </strong>
                  &nbsp; To &nbsp;
                  <strong>
                    {shortenAddress(
                      tx?.messages[0]?.value?.validatorDstAddress,
                      27
                    )}
                  </strong>
                </p>
              ) : null}
              {tx?.messages.length > 1 ? (
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Link
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      onShowMoreTxns(tx.messages);
                    }}
                  >
                    Show more
                  </Link>
                </div>
              ) : null}
            </Box>
          )}
        </StyledTableCell>
        <StyledTableCell>
          {tx?.signatures?.length || 0}/{membersCount}
        </StyledTableCell>
        <StyledTableCell align="left">
          {(tx?.signatures?.length || 0) >= threshold
            ? tx?.status === "SUCCESS" || tx?.status === "FAILED"
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
                address={multisigAccount?.account?.address}
                signatures={tx?.signatures}
                txId={tx?.id}
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
              dispatch(
                deleteTxn({
                  address: tx?.multisig_address,
                  id: tx?.id,
                })
              );
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

TableRowComponent.propTypes = {
  tx: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  onShowError: PropTypes.func.isRequired,
  onShowMoreTxns: PropTypes.func.isRequired,
  multisigAccount: PropTypes.object.isRequired,
};

export default function Transactions(props) {
  const dispatch = useDispatch();
  const { membersCount } = props;
  const txnsState = useSelector((state) => state.multisig?.txns || {});
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
  }, []);

  const [errorMsg, setErrorMsg] = useState("");
  const [openError, setOpenError] = useState(false);

  const [txnsListDialog, setTxnsListDialog] = useState(false);
  const [selectedMsgs, setSelectedTxns] = useState({});
  const chainInfo = useSelector((state) => state.wallet.chainInfo);

  const multisigAccount = useSelector(
    (state) => state.multisig.multisigAccount
  );

  return (
    <Box>
      {/* {txnsState?.status !== "pending" && !txnsState.list?.length ? (
        <Typography variant="h6" sx={{mt: 2}}>
          No transactions found
        </Typography>
      ) : (
        ""
      )}
      {txnsState?.status === "pending" ? <CircularProgress size={40} /> : null}
 */}

      <>
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
                {txnsState.list.length === 0 ? (
                  <Typography sx={{ width: "100%", justifyContent: "center" }}>
                    No Transactions Found
                  </Typography>
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
                        <StyledTableCell>Signed</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="center">
                          Transaction Url
                        </StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {txnsState.list.map((row, index) => (
                        <TableRowComponent
                          key={index}
                          tx={row}
                          type="history"
                          onShowError={() => {
                            setErrorMsg(row?.err_msg);
                            setOpenError(true);
                          }}
                          onShowMoreTxns={(msgs) => {
                            setSelectedTxns(msgs);
                            setTxnsListDialog(true);
                          }}
                          multisigAccount={multisigAccount}
                          membersCount={membersCount}
                        />
                      ))}
                    </TableBody>
                  </>
                )}
              </>
            ) : (
              <>
                {txnsState.list.length === 0 ? (
                  <Typography sx={{ width: "100%", justifyContent: "center" }}>
                    No Transactions Found
                  </Typography>
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
                        <StyledTableCell>Signed</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {txnsState.list.map((row, index) => (
                        <TableRowComponent
                          key={index}
                          tx={row}
                          type="active"
                          onShowError={() => {
                            setErrorMsg(row?.err_msg);
                            setOpenError(true);
                          }}
                          onShowMoreTxns={(msgs) => {
                            setSelectedTxns(msgs);
                            setTxnsListDialog(true);
                          }}
                          multisigAccount={multisigAccount}
                          membersCount={membersCount}
                        />
                      ))}
                    </TableBody>
                  </>
                )}
              </>
            )}
          </Table>
        </TableContainer>
      </>

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

      {chainInfo?.config && txnsListDialog ? (
        <DialogMultisigMessages
          open={txnsListDialog}
          onClose={(e) => setTxnsListDialog(false)}
          currency={chainInfo.config.currencies[0]}
          msgs={selectedMsgs}
        />
      ) : null}
    </Box>
  );
}

Transactions.propTypes = {
  address: PropTypes.string.isRequired,
};
