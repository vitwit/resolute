import { Typography, Avatar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function StakingGrants(props) {
  const { chainName } = props;

  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);
  const networks = useSelector((state) => state.wallet.networks);

  const chainID = nameToChainIDs?.[chainName];
  const chainInfo = networks[chainID]?.network;
  const chainLogo = chainInfo?.logos?.menu;
  return (
    <>
      <div style={{display: "flex"}}>
        <Avatar src={chainLogo} sx={{ width: 36, height: 36 }} />
        <Typography
          align="left"
          variant="h6"
          gutterBottom
          color="text.secondary"
          sx={{
            ml: 2,
          }}
        >
          {chainName}
        </Typography>
      </div>
    </>
  );
}

export default StakingGrants;
