import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PropTypes from 'prop-types';
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
} from "../../../features/multisig/multisigSlice";
import BroadcastTx from "../BroadcastTx";
import SignTxn from "../SignTxn";
import { useParams } from "react-router-dom";
import { shortenAddress } from "../../../utils/util";
import { parseTokens } from "../../../utils/denom";
import { setError } from "../../../features/common/commonSlice";

const mapTxns = {
  "/cosmos.staking.v1beta1.MsgDelegate": "Delegate",
  "/cosmos.bank.v1beta1.MsgSend": "Send",
  "/cosmos.staking.v1beta1.MsgBeginRedelegate": "Re-Delegate",
  "/cosmos.staking.v1beta1.MsgUndelegate": "Un-Delegate",
  Msg: "Tx Msg",
};

const TableRowComponent = ({ tx }) => {
  const { address } = useParams();
  const walletAddress = useSelector((state) => state.wallet.address);

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

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo } = wallet;

  const displayDenom = (amountObj) => {
    return parseTokens(
      amountObj,
      chainInfo?.config?.currencies[0].coinDenom,
      chainInfo?.config?.currencies[0].coinDecimals
    );
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {tx?.msgs.map((msg) => (
            <>
              {msg.typeUrl === "/cosmos.bank.v1beta1.MsgSend" ? (
                <p>
                  <p>
                    {mapTxns[msg?.typeUrl]} &nbsp;
                    <strong>{displayDenom(msg?.value?.amount)}</strong>
                    &nbsp;To&nbsp;{" "}
                    <strong>
                      {" "}
                      {shortenAddress(msg?.value?.toAddress, 27)}
                    </strong>
                  </p>
                </p>
              ) : null}

              {msg.typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" ? (
                <span>
                  <p>
                    {mapTxns[msg?.typeUrl]}{" "}
                    <strong>{displayDenom(msg?.value?.amount)}</strong>
                    &nbsp; To &nbsp;
                    <strong>
                      {shortenAddress(msg?.value?.validatorAddress, 27)}
                    </strong>
                  </p>
                </span>
              ) : null}

              {msg.typeUrl === "/cosmos.staking.v1beta1.MsgUndelegate" ? (
                <span>
                  <p>
                    {mapTxns[msg?.typeUrl]}{" "}
                    <strong>{displayDenom(msg?.value?.amount)}</strong>
                    &nbsp; From &nbsp;
                    <strong>
                      {shortenAddress(msg?.value?.validatorAddress, 27)}
                    </strong>
                  </p>
                </span>
              ) : null}

              {msg.typeUrl === "/cosmos.staking.v1beta1.MsgBeginRedelegate" ? (
                <span>
                  <p>
                    {mapTxns[msg?.typeUrl]} &nbsp;
                    <strong>{displayDenom(msg?.value?.amount)}</strong>
                    &nbsp;
                    <p>
                      From &nbsp;
                      <strong>
                        {shortenAddress(msg?.value?.validatorSrcAddress, 27)}
                      </strong>
                      &nbsp; To &nbsp;
                      <strong>
                        {shortenAddress(msg?.value?.validatorDstAddress, 27)}
                      </strong>
                    </p>
                  </p>
                </span>
              ) : null}
            </>
          ))}
        </TableCell>
        <TableCell>
          {tx?.signatures?.length || 0}/{threshold}
        </TableCell>
        <TableCell align="right">
          {tx?.signatures?.length || 0 >= threshold ? (
            <span>
              {tx?.status === "DONE" || tx?.status === "FAILED"
                ? tx?.status
                : "Waiting for brodcast"}
            </span>
          ) : (
            <span>
              {!isWalletSigned()
                ? "Waiting for your sign"
                : "Waiting for others to sign"}
            </span>
          )}
        </TableCell>
        <TableCell align="right">
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
              multisigAccount={multisigAccount}
              signatures={tx?.signatures}
              txId={tx?._id}
              tx={tx}
            />
          )}
        </TableCell>
        <TableCell style={{ display: "flex" }} align="right">
          <DeleteIcon
            style={{ marginTop: 24, color: "red" }}
            onClick={() => {
              dispatch(deleteTxn(tx?._id));
            }}
          />
          {/* <Button   variant='contained'>Delete</Button> */}
          {/* <br/> */}
          <IconButton
            align="right"
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            <h5>Raw</h5>
            {open ? (
              <KeyboardArrowUpIcon align="right" />
            ) : (
              <KeyboardArrowDown align="right" />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ width: "50%", paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <pre style={{ width: 100 }}>{JSON.stringify(tx, null, 2)}</pre>
          </Collapse>
        </TableCell>
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
    dispatch(getTxns({ address: props.address, status: status }));
  };

  useEffect(() => {
    if (deleteTxnStatus?.status === "done" || deleteTxnStatus?.status === 200) {
      dispatch(setError({ type: "success", message: "Successfully deleted" }));
    } else if (deleteTxnStatus?.status === "error") {
      dispatch(
        setError({ type: "error", message: "Error while deleting the txn" })
      );
    }
    getAllTxns("history");
  }, [deleteTxnStatus]);

  useEffect(() => {
    getAllTxns("current");
  }, [updateTxnStatus]);

  useEffect(() => {
    if (createSignRes?.status === "done" || createSignRes?.status === 201) {
      dispatch(setError({ type: "success", message: "Successfully signed" }));
    } else if (createSignRes?.status === "error") {
      dispatch(
        setError({
          type: "error",
          message: "Error while signing the transaction",
        })
      );
    }
    getAllTxns();
  }, [createSignRes]);

  useEffect(() => {
    if (createTxRes?.status === "done") {
      dispatch(setError({ type: "success", message: "Successfully created" }));
    } else if (createTxRes?.status === "error") {
      dispatch(
        setError({ type: "error", message: "Error while creating the txn" })
      );
    }
    getAllTxns();
  }, [createTxRes]);

  useEffect(() => {
    getAllTxns();
  }, []);

  return (
    <TableContainer component={Box}>
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
              getAllTxns("current");
              setIsHistory(false);
            }}
          >
            Active
          </Button>
          <Button
            variant={isHistory ? "contained" : "outlined"}
            onClick={() => {
              getAllTxns("history");
              setIsHistory(true);
            }}
          >
            Completed
          </Button>
        </ButtonGroup>
      </Box>

      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Msgs</TableCell>
            <TableCell>No of Signatures</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {txns.map((row, index) => (
            <TableRowComponent key={index} tx={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Transactions.propTypes = {
  address: PropTypes.string.isRequired,
};