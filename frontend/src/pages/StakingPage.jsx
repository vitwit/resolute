import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SelectNetwork from "../components/common/SelectNetwork";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import Validators from "./Validators";
import StakingOverview from "./stakingOverview/StakingOverview";
import { getGrantsToMe } from "../features/authz/authzSlice";
import { Consensus } from "cosmjs-types/tendermint/version/types";

export const filterDelegateAuthz = (authzs) => {
  const result = {};

  for (const chainID in authzs) {
    const granters = [];
    const grants = authzs[chainID]?.grants || [];
    for (const grant of grants) {
      const authorizationType = grant?.authorization["@type"];
      const isGenericAuthorization =
        authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
      const isMsgDelegate =
        grant?.authorization.msg === "/cosmos.staking.v1beta1.MsgDelegate";
      if (isGenericAuthorization && isMsgDelegate) {
        granters.push(grant.granter);
      }
    }
    result[chainID] = granters;
  }

  return result;
};

export default function StakingPage() {
  const wallet = useSelector((state) => state.wallet);
  const stakingChains = useSelector((state) => state.staking.chains);
  const networks = useSelector((state) => state.wallet.networks);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const nameToChainIDs = wallet.nameToChainIDs;
  let currentNetwork = params.networkName;
  const defaultChain = "cosmoshub";
  const chainID = nameToChainIDs?.[currentNetwork] || defaultChain;
  const chainInfo = networks[chainID]?.network;
  const address = networks[chainID]?.walletInfo.bech32Address;
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);

  // Delegate Authz
  const [isNoDelegateAuthzs, setIsNoDelegateAuthz] = useState(false);
  const [delegateAuthzGrants, setDelegateAuthzGrants] = useState({});

  useEffect(() => {
    const result = filterDelegateAuthz(grantsToMe);
    if (result?.[chainID]?.length === 0) {
      setIsNoDelegateAuthz(true);
    } else {
      setIsNoDelegateAuthz(false);
      setDelegateAuthzGrants(result);
    }
  }, [grantsToMe, address, isAuthzMode]);

  const handleOnSelect = (chainName) => {
    navigate(`/${chainName}/staking`);
  };

  useEffect(() => {
    if (address?.length > 0) {
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest + "/",
          grantee: address,
          chainID: chainID,
        })
      );
    }
  }, [chainInfo, currentNetwork, params, isAuthzMode, address]);

  return (
    <div>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
          <Typography color="text.primary" variant="h6" fontWeight={600}>
            STAKING
          </Typography>
          <SelectNetwork
            onSelect={(name) => {
              handleOnSelect(name);
            }}
            networks={Object.keys(nameToChainIDs)}
            defaultNetwork={
              currentNetwork?.length > 0
                ? currentNetwork.toLowerCase().replace(/ /g, "")
                : defaultChain
            }
          />
        </Box>
        {currentNetwork ? (
          <div sx={{ justifyContent: "center", display: "flex", mr: 1 }}>
            {Object.keys(stakingChains)?.length > 0 ? (
              <Validators
                chainID={nameToChainIDs[currentNetwork]}
                currentNetwork={currentNetwork}
                nameToChainIDs={nameToChainIDs}
                isAuthzMode={isAuthzMode}
                delegateGrantsToMe={delegateAuthzGrants[chainID] || []}
                isNoDelegateAuthzs={isNoDelegateAuthzs}
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <StakingOverview />
        )}
      </Paper>
    </div>
  );
}
