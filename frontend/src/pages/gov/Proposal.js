import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProposalInfo from "./ProposalInfo";

function Proposal() {
  const stakingChains = useSelector((state) => state.staking.chains);
  const distributionChains = useSelector((state) => state.distribution.chains);
  const [stakingLoaded, setStakingLoaded] = useState(false);
  const [distributionLoaded, setDistributionLoaded] = useState(false);

  useEffect(() => {
    if (!stakingLoaded && Object.keys(stakingChains).length) {
      setStakingLoaded(true);
    }
  }, [stakingChains]);

  useEffect(() => {
    if (!distributionLoaded && Object.keys(stakingChains).length) {
      setDistributionLoaded(true);
    }
  }, [distributionChains]);
  return <>{stakingLoaded && distributionLoaded && <ProposalInfo />}</>;
}

export default Proposal;
