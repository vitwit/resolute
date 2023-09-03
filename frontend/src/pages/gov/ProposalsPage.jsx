import React, { useEffect, useState } from "react";
import Proposals from "./chain/Proposals";
import { useDispatch, useSelector } from "react-redux";
import ConnectWallet from "../../components/ConnectWallet";
import { CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import SelectNetwork from "../../components/common/SelectNetwork";

export const filterVoteAuthz = (authzs) => {
  return Object.keys(authzs).reduce((result, chainID) => {
    const granters = authzs[chainID]?.grants
      .filter(
        (grant) =>
          (grant?.authorization["@type"] ===
            "/cosmos.authz.v1beta1.GenericAuthorization" &&
            grant?.authorization.msg === "/cosmos.gov.v1beta1.MsgVote") ||
          grant?.authorization.msg === "/cosmos.gov.v1.MsgVote"
      )
      .map((grant) => grant.granter);

    return { ...result, [chainID]: granters };
  }, {});
};

function ProposalsPage() {
  const [authzGrants, setAuthzGrants] = useState({});
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const walletConnected = useSelector((state) => state.wallet.connected);
  const networks = useSelector((state) => state.wallet.networks);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const nameToIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const loading = useSelector((state) => state.gov.loading);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const authzTabs = useSelector((state) => state.authz.tabs);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentNetwork = params?.networkName;

  useEffect(() => {
    if (loading && defaultLoading) {
      setDefaultLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const result = filterVoteAuthz(grantsToMe);
    setDefaultLoading(false);
    setSelectedNetwork(
      params?.networkName ? nameToIDs[params.networkName] : ""
    );
    setAuthzGrants(result);
  }, [grantsToMe, nameToIDs, params]);

  const selectedNetworkData =
    selectedNetwork && networks[selectedNetwork]?.network;

  const proposalComponent = selectedNetworkData ? (
    <Proposals
      restEndpoint={selectedNetworkData.config.rest}
      chainName={selectedNetworkData.config.chainName}
      chainLogo={selectedNetworkData.logos.menu}
      signer={networks[selectedNetwork].walletInfo?.bech32Address}
      gasPriceStep={selectedNetworkData.config.feeCurrencies?.[0]?.gasPriceStep}
      aminoConfig={selectedNetworkData.aminoConfig}
      bech32Config={selectedNetworkData.config.bech32Config}
      chainID={selectedNetworkData.config.chainId}
      currencies={selectedNetworkData.config.currencies}
      authzMode={isAuthzMode}
      grantsToMe={authzGrants[selectedNetworkData.config.chainId] || []}
      id={1}
      isChainSpecific={true}
    />
  ) : (
    Object.keys(networks).map((key, index) => (
      <Proposals
        key={index}
        restEndpoint={networks[key].network.config.rest}
        chainName={networks[key].network.config.chainName}
        chainLogo={networks[key].network.logos.menu}
        signer={networks[key].walletInfo?.bech32Address}
        gasPriceStep={
          networks[key].network.config.feeCurrencies?.[0]?.gasPriceStep
        }
        aminoConfig={networks[key].network.aminoConfig}
        bech32Config={networks[key].network.config.bech32Config}
        chainID={networks[key].network.config.chainId}
        currencies={networks[key].network.config.currencies}
        authzMode={isAuthzMode}
        grantsToMe={authzGrants[networks[key].network.config.chainId] || []}
        id={index}
        isChainSpecific={false}
      />
    ))
  );

  return (
    <>
      {walletConnected ? (
        <>
          {isAuthzMode && !authzTabs?.govEnabled ? (
            <Typography variant="h6" fontWeight={600} color="text.primary">
              You don't have authz permission.
            </Typography>
          ) : selectedNetworkData ? (
            <>
              <ChangeNetwork
                navigate={navigate}
                nameToChainIDs={nameToChainIDs}
                currentNetwork={currentNetwork}
              />
              {proposalComponent}
            </>
          ) : defaultLoading ? null : (
            <>
              <ChangeNetwork
                navigate={navigate}
                nameToChainIDs={nameToChainIDs}
                currentNetwork={currentNetwork}
              />
              {proposalComponent}
            </>
          )}
        </>
      ) : (
        <ConnectWallet />
      )}

      {(loading || defaultLoading) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ mt: 4 }} />
        </Box>
      )}
    </>
  );
}

const ChangeNetwork = (props) => {
  const { currentNetwork, navigate, nameToChainIDs } = props;
  return (
    <Box
      item
      xs={1}
      md={3}
      sx={{ display: "flex", justifyContent: "flex-end" }}
    >
      <SelectNetwork
        onSelect={(name) => {
          if (name === "allnetworks") {
            navigate(`/gov`);
          } else {
            navigate(`/${name}/gov`);
          }
        }}
        networks={[...Object.keys(nameToChainIDs), "All Networks"]}
        defaultNetwork={
          currentNetwork?.length > 0
            ? currentNetwork.toLowerCase().replace(/ /g, "")
            : "allnetworks"
        }
      />
    </Box>
  );
};

export default ProposalsPage;
