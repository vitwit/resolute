import React, { useEffect } from "react";
import { Typography, Button, Grid } from "@mui/material";
import AuthzDelegations from "./AuthzDelegations";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthzDelegations } from "../../features/staking/stakeSlice";

function StakingGranter({ granter, delegateAuthzGrants, chainInfo }) {
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

  useEffect(() => {
    dispatch(
      getAuthzDelegations({
        baseURL: chainInfo?.config?.rest,
        chainID: chainInfo?.config?.chainId,
        address: granter,
      })
    );
  }, []);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography fontWeight={500} color="text.primary" gutterBottom>
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
          >
            Claim Rewards: 0
          </Button>
        </Grid>
      </Grid>
      <AuthzDelegations
        chainID={chainID}
        currency={currency}
        delegations={delegations}
        validators={validators}
      />
    </>
  );
}

export default StakingGranter;
