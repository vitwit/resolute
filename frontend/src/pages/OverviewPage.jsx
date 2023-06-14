import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SelectNetwork from "../components/common/SelectNetwork";
import { resetDefaultState as distributionResetDefaultState } from "../features/distribution/distributionSlice";
import { resetDefaultState as stakingResetDefaultState } from "../features/staking/stakeSlice";
import Overview from "./Overview";

export default function OverviewPage() {
  const defaultChainName = "cosmoshub";
  const wallet = useSelector((state) => state.wallet);
  const networks = useSelector((state) => state.wallet.networks);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const nameToChainIDs = wallet.nameToChainIDs;
  let currentNetwork = params.networkName;

  // when "/:network/overview" is directly accessed or reloaded, It won't be rendered properly. So we do this!
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (currentNetwork && !loaded) {
      navigate(`/`);
    } else if (!currentNetwork) {
      setLoaded(true);
    }
  }, [currentNetwork]);

  useEffect(() => {
    dispatch(stakingResetDefaultState(Object.keys(networks)));
    dispatch(distributionResetDefaultState(Object.keys(networks)));
  }, [wallet]);

  const handleOnSelect = (chainName) => {
    navigate(`/${chainName}/overview`);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
        <div></div>
        <SelectNetwork
          onSelect={(name) => {
            handleOnSelect(name);
          }}
          networks={Object.keys(nameToChainIDs)}
          defaultNetwork={
            currentNetwork?.length > 0
              ? currentNetwork.toLowerCase().replace(/ /g, "")
              : defaultChainName
          }
        />
      </Box>
      {currentNetwork?.length > 0 && Object.keys(nameToChainIDs).length > 0 && (
        <Overview
          chainID={nameToChainIDs[currentNetwork]}
          chainName={currentNetwork}
        />
      )}
    </div>
  );
}
