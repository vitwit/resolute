import Grid from "@mui/material/Grid";
import React, { useState, useMemo, useEffect } from "react";
import { getSendAuthz } from "../../utils/authorizations";
import { useDispatch, useSelector } from "react-redux";
import {
  authzExecHelper,
  getGrantsToMe,
} from "../../features/authz/authzSlice";
import {
  resetError,
  resetTxHash,
  setError,
} from "./../../features/common/commonSlice";
import { getBalances, txBankSend } from "../../features/bank/bankSlice";
import Alert from "@mui/material/Alert";
import { useParams, useNavigate } from "react-router-dom";
import { parseBalance } from "../../utils/denom";
import Box from "@mui/material/Box";
import SelectNetwork from "../../components/common/SelectNetwork";
import { Typography } from "@mui/material";
import DelegatorTransfer from "./DelegatorTransfer";

export const filterSendAuthz = (authzs) => {
  const result = {};

  for (const chainID in authzs) {
    const granters = [];
    const grants = authzs[chainID]?.grants || [];
    for (const grant of grants) {
      const authorizationType = grant?.authorization["@type"];
      const isGenericAuthorization =
        authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
      const isSendAuthorization =
        authorizationType === "/cosmos.bank.v1beta1.SendAuthorization";
      const isMsgSend =
        grant?.authorization.msg === "/cosmos.bank.v1beta1.MsgSend";
      if ((isGenericAuthorization && isMsgSend) || isSendAuthorization) {
        granters.push(grant.granter);
      }
    }
    result[chainID] = granters;
  }

  return result;
};

export default function DelegatorSendPage() {
  const params = useParams();
  const navigate = useNavigate();
  const selectedNetwork = useSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const [currentNetwork, setCurrentNetwork] = useState(
    params?.networkName || selectedNetwork.toLowerCase()
  );

  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const from =
    networks[nameToChainIDs[currentNetwork]]?.walletInfo.bech32Address;

  const currency =
    networks[nameToChainIDs[currentNetwork]]?.network.config.currencies;
  const chainID = nameToChainIDs[currentNetwork];
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
  const selectedAuthz = useSelector((state) => state.authz.selected);
  const isAuthzMode = useSelector((state) => state.common.authzMode);

  const authzSend = useMemo(
    () => getSendAuthz(grantsToMe.grants, selectedAuthz.granter),
    [grantsToMe.grants]
  );
  const [granter, setGranter] = React.useState(
    grantsToMe?.length > 0 ? grantsToMe[0] : ""
  );

  const [isNoAuthzs, setNoAuthzs] = useState(false);
  const [authzGrants, setAuthzGrants] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetTxHash());
    };
  }, []);

  useEffect(() => {
    const result = filterSendAuthz(grantsToMe);
    if (result?.[chainID]?.length === 0) {
      setNoAuthzs(true);
    } else {
      setNoAuthzs(false);
      setAuthzGrants(result);
    }
  }, [grantsToMe]);

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
      if (!isAuthzMode) {
        dispatch(
          getBalances({
            baseURL: chainInfo.config.rest,
            address: address,
            chainID: nameToChainIDs[currentNetwork],
          })
        );
      } else {
        dispatch(
          getBalances({
            baseURL: chainInfo.config.rest,
            address: granter,
            chainID: nameToChainIDs[currentNetwork],
          })
        );
      }

      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest,
          grantee: address,
          chainID: nameToChainIDs[currentNetwork],
        })
      );
    }
  }, [chainInfo, currentNetwork, granter, isAuthzMode, sendTx?.status]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 10,
          }}
        >
          <SelectNetwork
            onSelect={(name) => {
              navigate(`/${name}/validator-delegator`);
            }}
            networks={Object.keys(nameToChainIDs)}
            defaultNetwork={
              currentNetwork?.length > 0
                ? currentNetwork.toLowerCase().replace(/ /g, "")
                : "cosmoshub"
            }
          />
        </Box>

        {isAuthzMode && isNoAuthzs ? (
          <>
            <Typography>You don't have authz permission.</Typography>
          </>
        ) : (
          <>
            <Grid container sx={{ mt: 2 }}>
              <Grid item xs={1} md={3}></Grid>
              <Grid item xs={10} md={6}>
                {selectedAuthz.granter.length > 0 &&
                authzSend?.granter !== selectedAuthz.granter ? (
                  <Alert>
                    You don't have permission to execute this transcation
                  </Alert>
                ) : (
                  <DelegatorTransfer
                    chainInfo={chainInfo}
                    chainID={chainID}
                    currentNetwork={currentNetwork}
                    available={
                      currency?.length > 0 && balances?.length > 0
                        ? parseBalance(
                            balances,
                            currency[0].coinDecimals,
                            currency[0].coinMinimalDenom
                          )
                        : 0
                    }
                    sendTx={sendTx}
                    authzTx={authzExecTx}
                    isAuthzMode={isAuthzMode}
                    grantsToMe={
                      authzGrants[
                        networks[chainID]?.network?.config?.chainId
                      ] || []
                    }
                    setGranter={setGranter}
                    granter={granter}
                  />
                )}
              </Grid>
              <Grid item xs={1} md={3}></Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}
