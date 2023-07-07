import React, { useEffect, useState } from "react";
import Proposals from "./Proposals";
import { useDispatch, useSelector } from "react-redux";
import ConnectWallet from "../../components/ConnectWallet";
import { CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { resetLoading } from "../../features/gov/govSlice";
import { Box } from "@mui/system";

export const filterVoteAuthz = (authzs) => {
  const result = {};
  const ids = Object.keys(authzs);
  for (let i = 0; i < ids.length; i++) {
    const granters = [];
    const chainID = ids[i];
    for (let j = 0; j < authzs[chainID]?.grants?.length; j++) {
      const grant = authzs[chainID]?.grants[j];
      if (
        (grant?.authorization["@type"] ===
          "/cosmos.authz.v1beta1.GenericAuthorization" &&
          grant?.authorization.msg === "/cosmos.gov.v1beta1.MsgVote") ||
        grant?.authorization.msg === "/cosmos.gov.v1.MsgVote"
      ) {
        granters.push(grant.granter);
      }
    }
    result[chainID] = granters;
  }

  return result;
};

function ActiveProposals() {
  const [isNoAuthzs, setNoAuthzs] = useState(false);
  const [authzGrants, setAuthzGrants] = useState({});
  const [defaultLoading, setDefaultLoading] = useState(true);

  const walletConnected = useSelector((state) => state.wallet.connected);
  const networks = useSelector((state) => state.wallet.networks);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const nameToIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const loading = useSelector((state) => state.gov.loading);
  const [selectedNetwork, setSelectedNetwork] = useState("");

  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetLoading({ chainsCount: Object.keys(networks).length }));
  }, [networks]);

  useEffect(() => {
    if (loading && defaultLoading) {
      setDefaultLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const result = filterVoteAuthz(grantsToMe);
    if (Object.keys(result).length === 0) {
      setNoAuthzs(true);
    } else {
      setNoAuthzs(false);
      setAuthzGrants(result);
    }
  }, [grantsToMe]);

  useEffect(() => {
    if (params?.networkName?.length > 0) {
      const chainID = nameToIDs[params.networkName];
      const chainIDs = Object.keys(networks);
      for (let i = 0; i < chainIDs.length; i++) {
        if (chainIDs[i] == chainID) {
          setSelectedNetwork(chainID);
          break;
        }
      }
    }
  }, [nameToIDs, params]);

  return (
    <>
      <>
        {walletConnected ? (
          <>
            {isAuthzMode && isNoAuthzs ? (
              <Typography>You don't have authz permission.</Typography>
            ) : selectedNetwork.length > 0 ? (
              <Proposals
                restEndpoint={networks[selectedNetwork].network?.config?.rest}
                chainName={networks[selectedNetwork].network?.config?.chainName}
                chainLogo={networks[selectedNetwork]?.network?.logos?.menu}
                signer={networks[selectedNetwork].walletInfo?.bech32Address}
                gasPriceStep={
                  networks[selectedNetwork].network?.config?.gasPriceStep
                }
                aminoConfig={networks[selectedNetwork].network.aminoConfig}
                bech32Config={
                  networks[selectedNetwork].network?.config.bech32Config
                }
                chainID={networks[selectedNetwork].network?.config?.chainId}
                currencies={
                  networks[selectedNetwork].network?.config?.currencies
                }
                authzMode={isAuthzMode}
                grantsToMe={
                  authzGrants[
                    networks[selectedNetwork].network?.config?.chainId
                  ] || []
                }
                id={1}
              />
            ) : (
              <>
                {defaultLoading ? (
                  <></>
                ) : (
                  Object.keys(networks).map((key, index) => (
                    <Proposals
                      restEndpoint={networks[key].network?.config?.rest}
                      chainName={networks[key].network?.config?.chainName}
                      chainLogo={networks[key]?.network?.logos?.menu}
                      signer={networks[key].walletInfo?.bech32Address}
                      gasPriceStep={networks[key].network?.config?.gasPriceStep}
                      aminoConfig={networks[key].network.aminoConfig}
                      bech32Config={networks[key].network?.config.bech32Config}
                      chainID={networks[key].network?.config?.chainId}
                      currencies={networks[key].network?.config?.currencies}
                      authzMode={isAuthzMode}
                      grantsToMe={
                        authzGrants[networks[key].network?.config?.chainId] ||
                        []
                      }
                      id={index}
                    />
                  ))
                )}
              </>
            )}
          </>
        ) : (
          <ConnectWallet />
        )}
      </>
      {(loading || defaultLoading) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            sx={{
              mt: 4,
            }}
          />
        </Box>
      )}
    </>
  );
}

export default ActiveProposals;
