import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SelectNetwork from "../components/common/SelectNetwork";
import Overview from "./Overview";
import { GeneralOverview } from "./general-overview/GeneralOverview";

export default function OverviewPage() {
  const [defaultLoaded, setDefaultLoaded] = useState(false);
  const staking = useSelector((state) => state.staking.chains);
  const distribution = useSelector((state) => state.distribution.chains);
  const networks = useSelector((state) => state.wallet.networks);
  const tokenInfo = useSelector(
    (state) => state.common.allTokensInfoState.info
  );

  useEffect(() => {
    if (
      !defaultLoaded &&
      Object.keys(staking).length &&
      Object.keys(distribution).length &&
      Object.keys(tokenInfo).length
    ) {
      setDefaultLoaded(true);
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
      {currentNetwork?.length > 0 && defaultLoaded ? (
        <Overview
          chainID={nameToChainIDs[currentNetwork]}
          chainName={currentNetwork}
        />
      ) : (
        defaultLoaded && (
          <GeneralOverview chainNames={Object.keys(nameToChainIDs)} />
        )
      )}
    </div>
  );
}
