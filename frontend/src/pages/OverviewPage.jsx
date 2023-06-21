import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  return (
    <div>
      {defaultLoaded && <GeneralOverview chainIDs={Object.keys(networks)} />}
    </div>
  );
}
