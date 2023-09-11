import { Typography, Avatar, Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantsToMe } from "../../../features/authz/authzSlice";
import StakingGranter from "./StakingGranter";
import PropTypes from "prop-types";
import {
  GENERIC_AUTHORIZATION,
  MSG_BEGIN_REDELEGATE,
  MSG_DELEGATE,
  MSG_WITHDRAW_DELEGATOR_REWARD,
  MSG_UNDELEGATE,
} from "./common";

const filterAuthzStaking = (grantsToMe, MsgType) => {
  const granters = [];
  const grants = grantsToMe?.grants || [];
  for (const grant of grants) {
    const authorizationType = grant?.authorization["@type"];
    const isGenericAuthorization = authorizationType === GENERIC_AUTHORIZATION;
    const isMsgAuthzStaking = grant?.authorization.msg === MsgType;
    if (isGenericAuthorization && isMsgAuthzStaking) {
      granters.push(grant.granter);
    }
  }
  return granters;
};

export default function StakingGrants(props) {
  const { chainName } = props;
  const dispatch = useDispatch();

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const networks = useSelector((state) => state.wallet.networks);

  const chainID = nameToChainIDs?.[chainName];
  const chainInfo = networks[chainID]?.network;
  const chainLogo = chainInfo?.logos?.menu;
  const address = networks[chainID]?.walletInfo.bech32Address;

  const grantsToMe = useSelector((state) => state.authz.grantsToMe?.[chainID]);

  const delegateAuthzGrants = filterAuthzStaking(grantsToMe, MSG_DELEGATE);
  const undelegateAuthzGrants = filterAuthzStaking(grantsToMe, MSG_UNDELEGATE);
  const redelegateAuthzGrants = filterAuthzStaking(
    grantsToMe,
    MSG_BEGIN_REDELEGATE
  );
  const withdrawAuthzGranters = filterAuthzStaking(
    grantsToMe,
    MSG_WITHDRAW_DELEGATOR_REWARD
  );

  useEffect(() => {
    if (address.length > 0) {
      dispatch(
        getGrantsToMe({
          baseURL: chainInfo.config.rest,
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
          ))}
        </>
      ) : null}
    </>
  );
}

StakingGrants.propTypes = {
  chainName: PropTypes.string.isRequired,
};
