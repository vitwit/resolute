import { Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantsToMe } from "../../features/authz/authzSlice";
import StakingGrants from "./StakingGrants";
import {
  GENERIC_AUTHORIZATION,
  MSG_BEGIN_REDELEGATE,
  MSG_DELEGATE,
  MSG_WITHDRAW_DELEGATOR_REWARD,
  MSG_UNDELEGATE,
} from "./common";

const checkAuthzGrants = (grantsToMe) => {
  const granters = [];
  const AuthzStakingMsgs = [
    MSG_BEGIN_REDELEGATE,
    MSG_DELEGATE,
    MSG_WITHDRAW_DELEGATOR_REWARD,
    MSG_UNDELEGATE,
  ];
  for (const chainID in grantsToMe) {
    const grants = grantsToMe[chainID]?.grants || [];
    for (const grant of grants) {
      const authorizationType = grant?.authorization["@type"];
      const isGenericAuthorization =
        authorizationType === GENERIC_AUTHORIZATION;
      const isAuthzStakingMsg = AuthzStakingMsgs.includes(
        grant?.authorization.msg
      );
      if (isGenericAuthorization && isAuthzStakingMsg) {
        granters.push(grant.granter);
      }
    }
  }
  return granters.length > 0;
};

export default function StakingAuthz() {
  const dispatch = useDispatch();

  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const grantsToMe = useSelector((state) => state.authz.grantsToMe);
  const wallet = useSelector((state) => state.wallet.name);

  const chains = Object.keys(nameToChainIDs);

  const [hasGrants, setHasGrants] = useState(false);

  useEffect(() => {
    for (let chainName in nameToChainIDs) {
      const chain = networks[nameToChainIDs[chainName]];
      const chainID = nameToChainIDs?.[chainName];
      const address = chain?.walletInfo?.bech32Address;
      const rest = chain?.network?.config?.rest;
      if (address.length > 0) {
        dispatch(
          getGrantsToMe({
            baseURL: rest + "/",
            grantee: address,
            chainID: chainID,
          })
        );
      }
    }
  }, [networks, wallet]);

  useEffect(() => {
    if (checkAuthzGrants(grantsToMe)) {
      setHasGrants(true);
    } else {
      setHasGrants(false);
    }
  }, [grantsToMe]);

  return (
    <>
      {hasGrants ? (
        <>
          <Paper elevation={0} sx={{ p: 4 }}>
            <Typography
              color="text.primary"
              align="left"
              variant="h6"
              fontWeight={600}
            >
              STAKING
            </Typography>
            {chains?.map((chainName, key) => (
              <>
                <StakingGrants key={key} chainName={chainName} />
              </>
            ))}
          </Paper>
        </>
      ) : (
        <>
          <Typography color="text.primary" variant="h4">
            You don't have authz permission.
          </Typography>
        </>
      )}
    </>
  );
}
