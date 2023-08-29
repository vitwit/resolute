import React, { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import SelectNetwork from "../../components/common/SelectNetwork";
import { useNavigate, useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import Validators from "./chain/Validators";
import StakingOverview from "./overview/StakingOverview";
import StakingAuthz from "./overview/StakingAuthz";
import { useEffect } from "react";
import { setActiveTab } from "../../features/common/commonSlice";

export default function StakingPage() {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
  const stakingChains = useSelector((state) => state.staking.chains);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const params = useParams();
  const navigate = useNavigate();
  const nameToChainIDs = wallet.nameToChainIDs;
  let currentNetwork = params.networkName;
  const defaultChain = "cosmoshub";

  const handleOnSelect = (chainName) => {
    navigate(`/${chainName}/staking`);
  };

  useEffect(() => {
    if (isAuthzMode) {
      navigate(`/staking`);
    }
  }, [isAuthzMode]);

  useEffect(() => {
    dispatch(setActiveTab("staking"));
  }, []);

  return (
    <div>
      {!isAuthzMode ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {currentNetwork?.length > 0 ? (
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
            ) : null}
          </Box>
          {currentNetwork ? (
            <div sx={{ justifyContent: "center", display: "flex", mr: 1 }}>
              {Object.keys(stakingChains)?.length > 0 ? (
                <Validators
                  chainID={nameToChainIDs[currentNetwork]}
                  currentNetwork={currentNetwork}
                  nameToChainIDs={nameToChainIDs}
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <StakingOverview />
          )}
        </Paper>
      ) : (
        <>{Object.keys(stakingChains)?.length > 0 ? <StakingAuthz /> : <></>}</>
      )}
    </div>
  );
}
