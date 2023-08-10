import React, { useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import { Validators } from "./Validators";
import { useDispatch, useSelector } from "react-redux";
import {
  getDelegatorTotalRewards,
  txWithdrawAllRewards,
} from "../../../features/distribution/distributionSlice";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FeegrantCheckbox } from "../../../components/FeegrantCheckbox";

export const Chain = (props) => {
  const chainID = props?.chain?.chainName;
  const wallet = useSelector((state) => state.wallet);
  const nameToChainIDs = wallet.nameToChainIDs;
  let chainName;
  Object.keys(nameToChainIDs).forEach((networkName) => {
    if (chainID == nameToChainIDs[networkName]) {
      chainName = networkName;
    }
  });
  const feegrant = useSelector(
    (state) => state.common.feegrant?.[chainName] || {}
  );
  const distTxStatus = useSelector(
    (state) => state.distribution.chains[chainID].tx
  );
  const delegations = useSelector(
    (state) => state.staking.chains[chainID].delegations
  );
  const [useFeegrant, setUseFeegrant] = React.useState(false);
  const dispatch = useDispatch();
  const chainInfo = wallet.networks[chainID];
  const currency = chainInfo.network?.config?.currencies[0];

  let chainReward = (+props?.chainReward?.totalRewards || 0).toLocaleString();
  let chainStakedAmount = (+props?.chain?.stakedAmount || 0).toLocaleString();

  const navigate = useNavigate();

  const onClickClaim = () => {
    let delegationPairs = [];
    delegations.delegations.delegations.forEach((item) => {
      delegationPairs.push({
        validator: item.delegation.validator_address,
        delegator: item.delegation.delegator_address,
      });
    });
    dispatch(
      txWithdrawAllRewards({
        msgs: delegationPairs,
        denom: currency.coinMinimalDenom,
        chainID: chainID,
        aminoConfig: chainInfo.network.aminoConfig,
        prefix: chainInfo.network.config.bech32Config.bech32PrefixAccAddr,
        rest: chainInfo.network.config.rest,
        feeAmount:
          chainInfo.network.config.feeCurrencies[0].gasPriceStep.average *
          10 ** currency.coinDecimals,
        feegranter: useFeegrant ? feegrant?.granter : "",
      })
    );
  };

  useEffect(() => {
    dispatch(
      getDelegatorTotalRewards({
        chainID: chainID,
        baseURL: chainInfo.network.config.rest,
        address: chainInfo.walletInfo.bech32Address,
      })
    );
  }, [distTxStatus.status]);

  return (
    <Card
      sx={{
        mb: 1,
      }}
      elevation={0}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Grid item>
            <div
              style={{
                display: "flex",
              }}
            >
              <Avatar
                src={props.chain.imageURL}
                sx={{
                  width: 36,
                  height: 36,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  align="left"
                  variant="body1"
                  color="text.primary"
                  fontWeight={600}
                  sx={{
                    ml: 1,
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() =>
                    navigate(
                      `/${chainInfo?.network?.config?.chainName.toLowerCase()}/staking`
                    )
                  }
                >
                  {chainInfo?.network?.config?.chainName}
                </Typography>
                <Typography
                  align="left"
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                  sx={{
                    ml: 1,
                  }}
                  gutterBottom
                >
                  Total staked:&nbsp;{chainStakedAmount}&nbsp;
                  {props.chain.denom}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item>
            <FeegrantCheckbox
              useFeegrant={useFeegrant}
              setUseFeegrant={setUseFeegrant}
              feegrant={feegrant}
            />
            <Button
              variant="contained"
              color="primary"
              disableElevation
              size="small"
              disabled={distTxStatus.status === "pending"}
              sx={{
                textTransform: "none",
              }}
              onClick={onClickClaim}
            >
              {distTxStatus.status === "pending" ? (
                <>
                  <CircularProgress size={18} />
                  &nbsp;&nbsp;Please wait...
                </>
              ) : (
                <>
                  Claim:&nbsp;{chainReward}&nbsp;{props.chain.denom}
                </>
              )}
            </Button>
          </Grid>
        </Grid>
        <Validators
          validators={props.chain.validators}
          rewards={props?.chainReward?.validators}
          denom={props.chain.denom}
        />
      </CardContent>
    </Card>
  );
};

Chain.propTypes = {
  chain: PropTypes.shape({
    chainName: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    stakedAmount: PropTypes.number.isRequired,
    denom: PropTypes.string.isRequired,
    validators: PropTypes.array.isRequired,
  }).isRequired,
  chainReward: PropTypes.shape({
    totalRewards: PropTypes.number.isRequired,
    validators: PropTypes.object.isRequired,
  }).isRequired,
};
