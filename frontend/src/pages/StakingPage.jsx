import Box from "@mui/material/Box";
import SelectNetwork from "../components/common/SelectNetwork";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import Validators from "./Validators";
import StakingOverview from "./stakingOverview/StakingOverview";
import StakingAuthz from "./stakingOverview/StakingAuthz";
import { useEffect } from "react";

export default function StakingPage() {
  const wallet = useSelector((state) => state.wallet);
  const stakingChains = useSelector((state) => state.staking.chains);
  const isAuthzMode = useSelector((state) => state.common.authzMode);
  const dispatch = useDispatch();
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
