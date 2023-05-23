import Grid from "@mui/material/Grid";
import React, { useState, useMemo, useEffect } from "react";
import { getSendAuthz } from "../utils/authorizations";
import { useDispatch, useSelector } from "react-redux";
import { authzExecHelper, getGrantsToMe } from "../features/authz/authzSlice";
import {
  resetError,
  resetFeegrant,
  resetTxHash,
  setError,
} from "./../features/common/commonSlice";
import { getBalances, txBankSend } from "../features/bank/bankSlice";
import Send from "../components/Send";
import { parseBalance } from "../utils/denom";
import Alert from "@mui/material/Alert";
import FeegranterInfo from "../components/FeegranterInfo";
import { useParams } from "react-router-dom";

export default function SendPage() {
  const [available, setBalance] = useState(0);
  const params = useParams();
  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(params?.networkName || selectedNetwork);

  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const from =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;

  const currency =
    networks[nameToChainIDs[currentNetwork]]?.network.config.currencies;

  const chainInfo = networks[nameToChainIDs[currentNetwork]]?.network;
  const address =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;

  const sendTx = useSelector((state) => state.bank.tx);
  const balance = useSelector((state) => state.bank.balances[nameToChainIDs[currentNetwork]]?.list[0]);
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
    setCurrentNetwork(params.networkName)
  },[params])

  useEffect(() => {
    if (chainInfo?.config?.currencies.length > 0 && address.length > 0) {
      if (selectedAuthz.granter.length === 0) {
        dispatch(
          getBalances({
            baseURL: chainInfo.config.rest+"/",
            address: address,
            chainID: nameToChainIDs[currentNetwork],
          })
        );
      } else {
        dispatch(
          getBalances({
            baseURL: chainInfo.config.rest+"/",
            address: selectedAuthz.granter,
            chainID: nameToChainIDs[currentNetwork]
          })
        );
      }

      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest+"/",
          grantee: address,
        })
      );
    }
  }, [chainInfo, currentNetwork]);

  useEffect(() => {
    if(balance){
      setBalance(
        parseBalance(
          [balance],
          currency[0]?.coinDecimals,
          currency[0]?.coinMinimalDenom
        )
      );
    }
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
            denom: currency[0].coinMinimalDenom,
            chainId: chainInfo.config.chainId,
            rest: chainInfo.config.rest,
            aminoConfig: chainInfo.aminoConfig,
            prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
            feeAmount:
              chainInfo.config.gasPriceStep.average *
              10 ** currency[0].coinDecimals,
            feegranter: feegrant.granter,
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
        denom: currency[0].coinMinimalDenom,
        chainId: chainInfo.config.chainId,
        rest: chainInfo.config.rest,
        aminoConfig: chainInfo.aminoConfig,
        prefix: chainInfo.config.bech32Config.bech32PrefixAccAddr,
        feeAmount:
          chainInfo.config.gasPriceStep.average * 10 ** currency[0].coinDecimals,
        feegranter: feegrant.granter,
      });
    }
  };

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(resetFeegrant());
  };

  return (
    <>
      {feegrant.granter.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
      <Grid container sx={{ mt: 4 }}>
        <Grid item xs={1} md={3}></Grid>
        <Grid item xs={10} md={6}>
          {selectedAuthz.granter.length > 0 &&
          authzSend?.granter !== selectedAuthz.granter ? (
            <Alert>You don't have permission to execute this transcation</Alert>
          ) : (
            <Send
              chainInfo={chainInfo}
              available={balance? available:0}
              onSend={onSendTx}
              sendTx={sendTx}
              authzTx={authzExecTx}
            />
          )}
        </Grid>

        <Grid item xs={1} md={3}></Grid>
      </Grid>
    </>
  );
}
