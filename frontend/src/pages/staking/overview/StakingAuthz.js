import { CircularProgress, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StakingGrants from "./StakingGrants";

export default function StakingAuthz() {
  const nameToChainIDs = useSelector((state) => state.wallet.nameToChainIDs);

  const chains = Object.keys(nameToChainIDs);

  const grantsToMe = useSelector((state) => state.authz.grantsToMe);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    for (let chainName in nameToChainIDs) {
      const chainID = nameToChainIDs[chainName];
      if (grantsToMe?.[chainID]?.status === "idle") {
        setLoading(false);
      }
    }
  }, []);

  return (
    <>
      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <Paper elevation={0} sx={{ p: 4 }}>
          {chains?.map((chainName, key) => (
            <>
              <StakingGrants key={key} chainName={chainName} />
            </>
          ))}
        </Paper>
      )}
    </>
  );
}
