import { useTheme } from "@emotion/react";
import { Typography, Avatar, Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantsToMe } from "../../features/authz/authzSlice";
import AuthzDelegations from "./AuthzDelegations";
import StakingGranter from "./StakingGranter";

export const filterDelegateAuthz = (grantsToMe) => {
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

export const filterUndelegateAuthz = (grantsToMe) => {
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

function StakingGrants(props) {
  const { chainName } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const networks = useSelector((state) => state.wallet.networks);

  const chainID = nameToChainIDs?.[chainName];
  const chainInfo = networks[chainID]?.network;
  const chainLogo = chainInfo?.logos?.menu;
  const address = networks[chainID]?.walletInfo.bech32Address;

  const [noDelegateAuthz, setNoDelegateAuthz] = useState(true);
  const [noUndelegateAuthz, setNoUndelegateAuthz] = useState(true);
  // const [allGranters, setAllGranters] = useState([]);

  const grantsToMe = useSelector((state) => state.authz.grantsToMe?.[chainID]);

  const delegateAuthzGrants = filterDelegateAuthz(grantsToMe);
  const undelegateAuthzGrants = filterUndelegateAuthz(grantsToMe);

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

  useEffect(() => {
    if (delegateAuthzGrants?.length) {
      setNoDelegateAuthz(false);
    }
    if (undelegateAuthzGrants?.length) {
      setNoUndelegateAuthz(false);
    }
  }, [delegateAuthzGrants, undelegateAuthzGrants]);

  const allGranters = [
    ...new Set([...delegateAuthzGrants, ...undelegateAuthzGrants]),
  ];

  return (
    <>
      {allGranters?.length ? (
        <>
          <div style={{ display: "flex" }}>
            <Avatar src={chainLogo} sx={{ width: 36, height: 36 }} />
            <Typography
              align="left"
              variant="h6"
              gutterBottom
              color="text.secondary"
              sx={{
                ml: 2,
                textTransform: "capitalize",
              }}
            >
              {chainName}
            </Typography>
          </div>
          {allGranters?.map((granter, index) => (
            <>
              <div key={index}>
                <StakingGranter
                  granter={granter}
                  delegateAuthzGrants={delegateAuthzGrants}
                  undelegateAuthzGrants={undelegateAuthzGrants}
                  chainInfo={chainInfo}
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
