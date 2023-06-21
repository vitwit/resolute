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
  removeFeegrant as removeFeegrantState,
  setFeegrant as setFeegrantState,
} from "./../features/common/commonSlice";
import { getBalances, txBankSend } from "../features/bank/bankSlice";
import Send from "../components/Send";
import Alert from "@mui/material/Alert";
import FeegranterInfo from "../components/FeegranterInfo";
import { useParams } from "react-router-dom";
import { parseBalance } from "../utils/denom";
import {
  getFeegrant,
  removeFeegrant as removeFeegrantLocalState,
} from "../utils/localStorage";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MultiTx from "./MultiTx";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `transfers-tab-${index}`,
    "aria-controls": `transfers-tabpanel-${index}`,
  };
}

export default function SendPage() {
  const params = useParams();
  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork
  );

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
  const balances = useSelector(
    (state) => state.bank.balances[nameToChainIDs[currentNetwork]]?.list
  );
  const [balance, setBalance] = useState({});
  const authzExecTx = useSelector((state) => state.authz.execTx);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[currentNetwork]
  );
  const selectedAuthz = useSelector((state) => state.authz.selected);

  const authzSend = useMemo(
    () => getSendAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants]
  );

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetTxHash());
    };
  }, []);

  useEffect(() => {
    if (balances?.length > 0) {
      for (let index = 0; index < balances?.length; index++) {
        const b = balances[index];
        if (b.denom === currency[0].coinMinimalDenom) {
          setBalance(b);
          break;
        }
      }
    }
  }, [balances]);

  useEffect(() => {
    if (params?.networkName?.length > 0) setCurrentNetwork(params.networkName);
    else setCurrentNetwork("cosmoshub");
  }, [params]);

  useEffect(() => {
    if (chainInfo?.config?.currencies.length > 0 && address.length > 0) {
      if (selectedAuthz.granter.length === 0) {
        dispatch(
          getBalances({
            baseURL: chainInfo.config.rest + "/",
            address: address,
            chainID: nameToChainIDs[currentNetwork],
          })
        );
      } else {
        dispatch(
          getBalances({
            baseURL: chainInfo.config.rest + "/",
            address: selectedAuthz.granter,
            chainID: nameToChainIDs[currentNetwork],
          })
        );
      }

      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest + "/",
          grantee: address,
        })
      );
    }
  }, [chainInfo, currentNetwork]);

  useEffect(() => {
    const currentChainGrants = getFeegrant()?.[currentNetwork];
    dispatch(
      setFeegrantState({
        grants: currentChainGrants,
        chainName: currentNetwork.toLowerCase(),
      })
    );
  }, [currentNetwork, params]);

  const onSendTx = (data) => {
    const amount = Number(data.amount);
    if (selectedAuthz.granter.length === 0) {
      if (
        Number(balance) <
        amount + Number(25000 / 10 ** currency[0].coinDecimals)
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
            feegranter: feegrant?.granter,
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
          chainInfo.config.gasPriceStep.average *
          10 ** currency[0].coinDecimals,
        feegranter: feegrant?.granter,
      });
    }
  };

  const removeFeegrant = () => {
    // Should we completely remove feegrant or only for this session.
    dispatch(removeFeegrantState(currentNetwork));
    removeFeegrantLocalState(currentNetwork);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {feegrant?.granter?.length > 0 ? (
        <FeegranterInfo
          feegrant={feegrant}
          onRemove={() => {
            removeFeegrant();
          }}
        />
      ) : null}
      {/* <Grid container sx={{ mt: 2 }}>
        <Grid item xs={1} md={3}></Grid>
        <Grid item xs={10} md={6}>
          {selectedAuthz.granter.length > 0 &&
            authzSend?.granter !== selectedAuthz.granter ? (
            <Alert>You don't have permission to execute this transcation</Alert>
          ) :
            (
              <Send
                chainInfo={chainInfo}
                available={currency?.length > 0 && balances?.length > 0 ? parseBalance(balances, currency[0].coinDecimals, currency[0].coinMinimalDenom) : 0}
                onSend={onSendTx}
                sendTx={sendTx}
                authzTx={authzExecTx}

              />
            )
          }
        </Grid>
        <Grid item xs={1} md={3}></Grid>
      </Grid> */}
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Send" {...a11yProps(0)} />
            <Tab label="Multi Send" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={1} md={3}></Grid>
            <Grid item xs={10} md={6}>
              {selectedAuthz.granter.length > 0 &&
              authzSend?.granter !== selectedAuthz.granter ? (
                <Alert>
                  You don't have permission to execute this transcation
                </Alert>
              ) : (
                <Send
                  chainInfo={chainInfo}
                  available={
                    currency?.length > 0 && balances?.length > 0
                      ? parseBalance(
                          balances,
                          currency[0].coinDecimals,
                          currency[0].coinMinimalDenom
                        )
                      : 0
                  }
                  onSend={onSendTx}
                  sendTx={sendTx}
                  authzTx={authzExecTx}
                />
              )}
            </Grid>
            <Grid item xs={1} md={3}></Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MultiTx 
            chainInfo={chainInfo}
            address={address}
            currency={currency}
           />
        </TabPanel>
      </Box>
    </>
  );
}
