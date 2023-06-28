import { Paper, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import StakingGrants from "./StakingGrants";

export default function StakingAuthz() {
  const networks = useSelector((state) => state.wallet.networks);
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const chains = Object.keys(nameToChainIDs);

  return (
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
                <StakingGrants chainName={chainName} />
            </>
        ))
        }
      </Paper>
    </>
  );
}
