import Grid from "@mui/material/Grid";
import React, { useState, useMemo, useEffect } from "react";
import { getSendAuthz } from "../utils/authorizations";
import { useDispatch, useSelector } from "react-redux";
import { authzExecHelper, getGrantsToMe } from "../features/authz/authzSlice";
import {
  resetError,
  resetTxHash,
  setError,
} from "./../features/common/commonSlice";
import { getBalance, txBankSend } from "../features/bank/bankSlice";
import Send from "../components/Send";
import { parseBalance } from "../utils/denom";
import Alert from "@mui/material/Alert";

export default function SendPage() {
  const [available, setBalance] = useState(0);

  const from = useSelector((state) => state.wallet.address);
  const currency = useSelector(
    (state) => state.wallet.chainInfo.config.currencies[0]
  );
  const chainInfo = useSelector((state) => state.wallet.chainInfo);
  const address = useSelector((state) => state.wallet.address);
  const sendTx = useSelector((state) => state.bank.tx);
  const balance = useSelector((state) => state.bank.balance);
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const feegrant = useSelector((state) => state.common.feegrant);

  const selectedAuthz = useSelector((state) => state.authz.selected);

  const authzSend = useMemo(
    () => getSendAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants]
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetError());
    dispatch(resetTxHash());
  }, []);

  useEffect(() => {
    if (chainInfo.config.currencies.length > 0 && address.length > 0) {
      if (selectedAuthz.granter.length === 0) {
        dispatch(
          getBalance({
            baseURL: chainInfo.config.rest,
            address: address,
            denom: currency.coinMinimalDenom,
          })
        );
      } else {
        dispatch(
          getBalance({
            baseURL: chainInfo.config.rest,
            address: selectedAuthz.granter,
            denom: currency.coinMinimalDenom,
          })
        );
      }

      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest,
          grantee: address,
        })
      );
    }
  }, [chainInfo]);

  useEffect(() => {
    setBalance(
      parseBalance(
        [balance.balance],
        currency?.coinDecimals,
        currency?.coinMinimalDenom
      )
    );
  }, [balance]);

  const onSendTx = (data) => {
    const amount = Number(data.amount);
    if (selectedAuthz.granter.length === 0) {
      if (
        Number(balance) <
        amount + Number(25000 / 10 ** currency.coinDecimals)
      ) {
        dispatch(
          setError({
            type: "error",
            message: "Not enough balance",
          })
        );
      } else {
        dispatch(
          txBankSend({
            from: from,
            to: data.to,
            amount: amount,
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.config.chainId,
            rest: chainInfo.config.rest,
            aminoConfig: chainInfo.aminoConfig,
            prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
            feeAmount:
              chainInfo.config.gasPriceStep.average *
              10 ** currency.coinDecimals,
            feegranter: data.feegranter,
          })
        );
      }
    } else {
      authzExecHelper(dispatch, {
        type: "send",
        from: address,
        granter: selectedAuthz.granter,
        recipient: data.to,
        amount: amount,
        denom: currency.coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency.coinDecimals,
        feegranter: data.feegranter,
      });
    }
  };

  return (
    <>
      <Grid container sx={{ mt: 4 }}>
        <Grid item xs={1} md={3}></Grid>
        <Grid item xs={10} md={6}>
          {selectedAuthz.granter.length > 0 &&
          authzSend?.granter !== selectedAuthz.granter ? (
            <Alert>You don't have permission to execute this transcation</Alert>
          ) : (
            <Send
              chainInfo={chainInfo}
              available={available}
              onSend={onSendTx}
              sendTx={sendTx}
              authzTx={authzExecTx}
              feegrant={feegrant}
            />
          )}
        </Grid>

        <Grid item xs={1} md={3}></Grid>
      </Grid>
    </>
  );
}
