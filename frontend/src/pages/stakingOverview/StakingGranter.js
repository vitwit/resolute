import React, { useEffect } from "react";
import { Typography, Button, Grid } from "@mui/material";
import AuthzDelegations from "./AuthzDelegations";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthzDelegations } from "../../features/staking/stakeSlice";
import { getAuthzDelegatorTotalRewards } from "../../features/distribution/distributionSlice";

function StakingGranter(props) {
  const { chainInfo, granter, delegateAuthzGrants, undelegateAuthzGrants, redelegateAuthzGrants, withdrawAuthzGranters } =
    props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const chainID = chainInfo?.config?.chainId;
  const validators = useSelector(
    (state) => state.staking.chains[chainID].validators
  );
  const delegations = useSelector(
    (state) => state.staking.chains?.[chainID]?.authzDelegations?.[granter]
  );
  const currency = useSelector(
    (state) => state.wallet.networks[chainID].network?.config?.currencies[0]
  );
  const rewards = useSelector(
    (state) =>
      state.distribution.chains[chainID].authzDelegatorRewards?.[granter]
  );

  const [totalRewards, setTotalRewards] = React.useState(0);

  useEffect(() => {
    dispatch(
      getAuthzDelegations({
        baseURL: chainInfo?.config?.rest,
        chainID: chainInfo?.config?.chainId,
        address: granter,
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getAuthzDelegatorTotalRewards({
        baseURL: chainInfo?.config?.rest,
        chainID: chainInfo?.config?.chainId,
        address: granter,
      })
    );
  }, []);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" sx={{mt: 1, mb: 1}}>
        <Grid item>
          <Typography fontWeight={500} color="text.primary">
            Granter: {granter}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant={theme.palette?.mode === "light" ? "outlined" : "contained"}
            className="button-capitalize-title"
            size="small"
            sx={{
              textTransform: "none",
              mr: 1,
            }}
            disableElevation
            disabled={!delegateAuthzGrants?.includes(granter)}
          >
            Delegate
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            size="small"
            sx={{
              textTransform: "none",
            }}
            disabled={!withdrawAuthzGranters.includes(granter)}
          >
            Claim Rewards: {totalRewards}
          </Button>
        </Grid>
      </Grid>
      <AuthzDelegations
        chainID={chainID}
        currency={currency}
        delegations={delegations}
        validators={validators}
        undelegateAuthzGrants={undelegateAuthzGrants}
        redelegateAuthzGrants={redelegateAuthzGrants}
        granter={granter}
        rewards={rewards?.list}
        setTotalRewards={setTotalRewards}
        totalRewards={totalRewards}
      />
    </>
  );
}

export default StakingGranter;
