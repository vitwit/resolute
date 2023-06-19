import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GeneralOverview } from "./general-overview/GeneralOverview";

export default function OverviewPage() {
  const [stakingReset, setStakingReset] = useState(false);
  const [distributionReset, setDistributionReset] = useState(false);
  const [tokenInfoReset, setTokenInfoReset] = useState(false);
  const staking = useSelector((state) => state.staking.chains);
  const distribution = useSelector((state) => state.distribution.chains);
  const networks = useSelector((state) => state.wallet.networks);
  const tokenInfo = useSelector(
    (state) => state.common.allTokensInfoState.info
  );

  useEffect(() => {
    if (!stakingReset && Object.keys(staking).length > 0) {
      setStakingReset(true);
    }
  }, [staking]);

  useEffect(() => {
    if (!distributionReset && Object.keys(distribution).length > 0) {
      setDistributionReset(true);
    }
  }, [distribution]);

  useEffect(() => {
    if (!tokenInfoReset && Object.keys(tokenInfo).length > 0) {
      setTokenInfoReset(true);
    }
  }, [tokenInfo]);

  return (
    <div>
      {stakingReset && distributionReset && tokenInfoReset && (
        <GeneralOverview chainIDs={Object.keys(networks)} />
      )}
    </div>
  );
}
