import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProposalInfo from "./ProposalInfo";
import { setActiveTab } from "../../../features/common/commonSlice";

function Proposal() {
  const dispatch = useDispatch();
  const stakingChains = useSelector((state) => state.staking.chains);
  const distributionChains = useSelector((state) => state.distribution.chains);
  const [stakingLoaded, setStakingLoaded] = useState(false);
  const [distributionLoaded, setDistributionLoaded] = useState(false);

  useEffect(() => {
    dispatch(setActiveTab("gov"));
  }, []);

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
