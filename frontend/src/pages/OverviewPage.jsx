import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SelectNetwork from "../components/common/SelectNetwork";
import Overview from "./Overview";
import { GeneralOverview } from "./general-overview/GeneralOverview";
import { CircularProgress } from "@mui/material";

export default function OverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const staking = useSelector((state) => state.staking.chains);
  const distribution = useSelector((state) => state.distribution.chains);
  const tokenInfo = useSelector(
    (state) => state.common.allTokensInfoState.info
  );

  useEffect(() => {
    if (
      isLoading &&
      Object.keys(staking).length &&
      Object.keys(distribution).length
    ) {
      setIsLoading(false);
    }
  }, [staking, distribution, tokenInfo]);

  const defaultChainName = "cosmoshub";
  const wallet = useSelector((state) => state.wallet);
  const params = useParams();
  const navigate = useNavigate();
  const nameToChainIDs = wallet.nameToChainIDs;
  let currentNetwork = params.networkName;

  const handleOnSelect = (chainName) => {
    navigate(`/${chainName}/overview`);
  };

  return (
    <>
      {isLoading ?

        <Box
          sx={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <CircularProgress
            sx={{
              mt: 4,
            }}
          />
        </Box>
        :
        currentNetwork?.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end"
              }}
            >
              <SelectNetwork
                style={{
                  justifyContent: "center"
                }}
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
            <Overview
              chainID={nameToChainIDs[currentNetwork]}
              chainName={currentNetwork}
            />
          </>
        ) : (
          <GeneralOverview
            chainNames={Object.keys(nameToChainIDs)}
          />
        )}
    </>
  );
}
