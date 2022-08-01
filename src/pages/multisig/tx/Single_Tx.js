import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchSingleMultiAccount,
  getSigns,
  getSingleTxn,
} from "../../../features/multisig/multisigSlice";
import BroadcastTx from "../BroadcastTx";
import SignTxn from "../SignTxn";

export const Single_Tx = (props) => {
  const { address, txId } = useParams();
  const dispatch = useDispatch();
  const txn = useSelector((state) => state.multisig.txn);
  const txnDetails = txn?.data?.data || {};

  const signatures = useSelector((state) => state.multisig.signatures);
  const multisigAccountDetails = useSelector(
    (state) => state.multisig.multisigAccount
  );
  const multisigAccount = multisigAccountDetails?.data?.data || {};

  const signDetails = signatures?.data?.data || [];

  const fetchTxn = () => {
    dispatch(getSingleTxn(txId));
    dispatch(getSigns({ address, txId }));
    dispatch(fetchSingleMultiAccount(address));
  };

  useEffect(() => {
    fetchTxn();
  }, [address]);

  const isSignCountMatched = () => {
    const threshold = Number(
      multisigAccount?.pubkeyJSON?.value?.threshold || 0
    );
    if (threshold >= signDetails.length) return true;
    else return false;
  };

  return (
    <div>
      <Grid>
        <Grid item xs={1} md={1}></Grid>
        <Grid item xs={10} md={10}>
          <Paper>
            <br />
            <h2>Transaction Details</h2>
            <br />

            <Box align="center">
              <Grid
                align="center"
                alignContent={"center"}
                alignSelf={"center"}
                textAlign={"center"}
              >
                {isSignCountMatched() ? (
                  txn?.status !== "COMPLETED" ? (
                    <BroadcastTx
                      txId={txId}
                      tx={txnDetails}
                      multisigAccount={multisigAccount}
                      signatures={signDetails}
                    />
                  ) : null
                ) : (
                  <SignTxn
                    txId={txId}
                    signatures={signDetails}
                    tx={txnDetails}
                  />
                )}
              </Grid>
            </Box>

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Multisig Address</TableCell>
                  <TableCell>
                    : <strong>{address}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tx ID</TableCell>
                  <TableCell>
                    : <strong>{txId}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fee</TableCell>
                  <TableCell>
                    :{" "}
                    <strong>
                      {txnDetails?.fee?.amount[0].amount || 0}{" "}
                      {txnDetails?.fee?.amount[0].denom || 0}
                    </strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gas</TableCell>
                  <TableCell>
                    : <strong>{txnDetails?.fee?.gas} </strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Signatures Count</TableCell>
                  <TableCell>
                    : <Button>{signDetails.length}</Button> |{" "}
                    <Button>
                      {Number(
                        multisigAccount?.pubkeyJSON?.value?.threshold || 0
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tx Details</TableCell>
                  <TableCell>
                    {" "}
                    <pre>{JSON.stringify(txnDetails?.msgs, null, 2)}</pre>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{txnDetails?.msgs[0].typeUrl}</TableCell>
                  <TableCell colSpan={2}>
                    {txnDetails?.msgs.map((m) => (
                      <>
                        {m.typeUrl === "/cosmos.bank.v1beta1.MsgSend" ? (
                          <span>
                            {m?.value?.fromAddress} <strong>send </strong>{" "}
                            <strong>
                              {m?.value?.amount[0].amount +
                                " " +
                                m?.value?.amount[0].denom}{" "}
                            </strong>{" "}
                            to {m?.value?.toAddress}
                          </span>
                        ) : null}
                        {m.typeUrl === "/cosmos.staking.v1beta1.MsgDelegate" ? (
                          <span>
                            {m?.value?.delegatorAddress}{" "}
                            <strong> delegate </strong>{" "}
                            <strong>
                              {m?.value?.amount.amount +
                                " " +
                                m?.value?.amount.denom}{" "}
                            </strong>{" "}
                            to {m?.value?.validatorAddress}
                          </span>
                        ) : null}
                      </>
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Signed By</TableCell>
                  <TableCell>
                    <pre>
                      <strong>
                        {signDetails &&
                          signDetails.map((s) => (
                            <span>{s.address || "-"}</span>
                          ))}
                      </strong>
                    </pre>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={1} md={1}></Grid>
      </Grid>
    </div>
  );
};
