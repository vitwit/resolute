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

export default function StakingAuthz() {
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chains = Object.keys(nameToChainIDs);

  return (
    <>
      <Paper elevation={0} sx={{ p: 4 }}>
        {chains?.map((chainName, key) => (
          <>
            <StakingGrants key={key} chainName={chainName} />
          </>
        ))}
      </Paper>
    </>
  );
}
