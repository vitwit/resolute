import { Typography, Avatar, Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantsToMe } from "../../features/authz/authzSlice";
import StakingGranter from "./StakingGranter";

const filterDelegateAuthz = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
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
  return granters;
};

const filterUndelegateAuthz = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization =
      authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
    const isMsgUndelegate =
      grant?.authorization.msg === "/cosmos.staking.v1beta1.MsgUndelegate";
    if (isGenericAuthorization && isMsgUndelegate) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

const filterRedelegateAuthz = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization =
      authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
    const isMsgBeginRedelegate =
      grant?.authorization.msg === "/cosmos.staking.v1beta1.MsgBeginRedelegate";
    if (isGenericAuthorization && isMsgBeginRedelegate) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

const filterWithdrawAuthz = (grantsToMe) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization =
      authorizationType === "/cosmos.authz.v1beta1.GenericAuthorization";
    const isMsgWithdrawDelegatorReward =
      grant?.authorization.msg ===
      "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
    if (isGenericAuthorization && isMsgWithdrawDelegatorReward) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

function StakingGrants(props) {
  const { chainName } = props;
  const dispatch = useDispatch();

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const networks = useSelector((state) => state.wallet.networks);

  const chainID = nameToChainIDs?.[chainName];
  const chainInfo = networks[chainID]?.network;
  const chainLogo = chainInfo?.logos?.menu;
  const address = networks[chainID]?.walletInfo.bech32Address;

  const grantsToMe = useSelector((state) => state.authz.grantsToMe?.[chainID]);

  const delegateAuthzGrants = filterDelegateAuthz(grantsToMe);
  const undelegateAuthzGrants = filterUndelegateAuthz(grantsToMe);
  const redelegateAuthzGrants = filterRedelegateAuthz(grantsToMe);
  const withdrawAuthzGranters = filterWithdrawAuthz(grantsToMe);

  useEffect(() => {
    if (address.length > 0) {
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest + "/",
          grantee: address,
          chainID: chainID,
        })
      );
    }
  }, [address]);

  const allGranters = [
    ...new Set([
      ...delegateAuthzGrants,
      ...undelegateAuthzGrants,
      ...redelegateAuthzGrants,
      ...withdrawAuthzGranters,
    ]),
  ];

  return (
    <>
      {allGranters?.length ? (
        <>
          <Box sx={{ display: "flex", mt: 1 }}>
            <Avatar src={chainLogo} sx={{ width: 36, height: 36 }} />
            <Typography
              align="left"
              variant="h6"
              gutterBottom
              color="text.primary"
              sx={{
                ml: 2,
                textTransform: "capitalize",
              }}
            >
              {chainName}
            </Typography>
          </Box>
          {allGranters?.map((granter, index) => (
            <>
              <div key={index}>
                <StakingGranter
                  granter={granter}
                  delegateAuthzGrants={delegateAuthzGrants}
                  undelegateAuthzGrants={undelegateAuthzGrants}
                  redelegateAuthzGrants={redelegateAuthzGrants}
                  withdrawAuthzGranters={withdrawAuthzGranters}
                  chainInfo={chainInfo}
                  address={address}
                />
              </div>
            </>
          ))}
        </>
      ) : null}
    </>
  );
}

export default StakingGrants;
