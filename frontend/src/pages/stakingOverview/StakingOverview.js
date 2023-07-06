import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { StakingTotal } from "./StakingTotal";
import {
  getDelegations,
  getAllValidators,
} from "../../features/staking/stakeSlice";
import { getDelegatorTotalRewards } from "../../features/distribution/distributionSlice";
import { Chain } from "./Chain";
import { getTokenPrice } from "../../features/common/commonSlice";
import { set } from "date-fns";

const StakingOverview = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
  const chainsmap = useSelector((state) => state.staking.chains);
  const rewardschainsMap = useSelector((state) => state.distribution.chains);
  const tokensPriceInfo = useSelector(
    (state) => state.common.allTokensInfoState.info
  );
  const [data, setData] = useState({
    totalAmount: 0,
    chains: [],
  });
  const [rewardData, setRewardData] = useState({
    totalReward: 0,
    chains: {},
  });

  const convertToDollars = (denom, amount = 0) => {
    let price = +tokensPriceInfo?.[denom]?.info?.["usd"] || 0;
    return amount * price;
  };

  let getRewardsObjectForProps = (wallet, rewardchainsMap) => {
    let chainIds = Object.keys(chainsmap);
    let chainsData = {};
    let totalRewardsInDollars = 0;
    for (let i = 0; i < chainIds.length; i++) {
      let decimal =
        wallet.networks[chainIds[i]]?.network?.config?.currencies[0]
          ?.coinDecimals;
      let coinMinimalDenom =
        wallet.networks[chainIds[i]]?.network.config?.currencies?.[0]
          ?.coinMinimalDenom;
      let totalRewards =
        rewardchainsMap?.[chainIds[i]]?.delegatorRewards?.totalRewards /
        10 ** decimal;
      totalRewardsInDollars += convertToDollars(
        coinMinimalDenom,
        +totalRewards
      );

      let validatorRewards =
        rewardchainsMap?.[chainIds[i]]?.delegatorRewards?.list;

      if (!validatorRewards || validatorRewards.length == 0) continue;
      let validatorMap = {};

      for (let j = 0; j < validatorRewards.length; j++) {
        let address = validatorRewards?.[j]?.validator_address;
        let rewards = validatorRewards?.[j].reward;
        let validatorReward = 0;
        for (let k = 0; k < rewards.length; k++) {
          validatorReward += +rewards[k].amount / 10 ** decimal;
        }
        validatorMap[address] = validatorReward.toFixed(3);
      }
      chainsData[chainIds[i]] = {
        totalRewards: totalRewards.toFixed(3),
        validators: validatorMap,
      };
    }
    chainsData.totalReward = totalRewardsInDollars;
    return chainsData;
  };

  let getStakingObjectForProps = (wallet, chainsmap) => {
    let chainIds = Object.keys(chainsmap);
    let chainsdata = [];
    let totalStakedInDollars = 0;
    for (let i = 0; i < chainIds.length; i++) {
      let decimal =
        wallet.networks[chainIds[i]]?.network?.config?.currencies[0]
          ?.coinDecimals;
      let chainTotalStaked =
        chainsmap[chainIds[i]]?.delegations?.totalStaked / 10 ** decimal;
      let delegations = chainsmap[chainIds[i]]?.delegations?.delegations;
      let validatorstore = chainsmap[chainIds[i]]?.validators;
      let denom =
        wallet.networks[chainIds[i]]?.network?.config?.currencies[0]?.coinDenom;
      let coinMinimalDenom =
        wallet.networks[chainIds[i]]?.network?.config?.currencies[0]
          ?.coinMinimalDenom;
      totalStakedInDollars += convertToDollars(
        coinMinimalDenom,
        +chainTotalStaked
      );
      if (
        delegations?.delegations?.length === undefined ||
        delegations?.delegations?.length === 0
      )
        continue;
      let validators = [];

      for (let j = 0; j < delegations?.delegations?.length; j++) {
        let validator = delegations.delegations[j].delegation.validator_address;
        let amount = delegations.delegations[j].balance.amount / 10 ** decimal;
        dispatch(getTokenPrice(denom));
        let validatorName =
          validatorstore?.active?.[validator]?.description?.moniker ||
          validatorstore?.inActive?.[validator]?.description?.moniker ||
          "unknown";
        if (validatorName === "unknown") continue;
        validators.push({
          validatorAddress: validator,
          validatorName: validatorName,
          stakedAmount: +amount,
        });
      }
      let chain = {
        chainName: chainIds[i],
        stakedAmount: chainTotalStaked.toFixed(3),
        denom: denom,
        validators: validators,
        imageURL: wallet.networks[chainIds[i]]?.network?.logos.menu,
      };
      chainsdata.push(chain);
    }
    setIsLoading(false);
    return {
      totalAmount: totalStakedInDollars,
      chains: chainsdata,
    };
  };

  useEffect(() => {
    let chainIds = Object.keys(wallet.networks);
    for (let i = 0; i < chainIds.length; i++) {
      let chainnetwork = wallet.networks[chainIds[i]];
      let address = chainnetwork?.walletInfo?.bech32Address;
      let baseURL = chainnetwork?.network?.config.rest;
      dispatch(
        getAllValidators({
          baseURL: baseURL,
          chainID: chainIds[i],
          status: null,
        })
      );
      dispatch(
        getDelegations({
          address: address,
          baseURL: baseURL,
          chainID: chainIds[i],
        })
      );
      dispatch(
        getDelegatorTotalRewards({
          chainID: chainIds[i],
          baseURL: baseURL,
          address: address,
        })
      );
    }
  }, [wallet]);

  useEffect(() => {
    if (Object.keys(chainsmap).length !== 0) {
      console.log("staking", chainsmap, isLoading);
      setData(getStakingObjectForProps(wallet, chainsmap));
    }
  }, [chainsmap]);

  useEffect(() => {
    if (Object.keys(rewardschainsMap)?.length) {
      setRewardData(getRewardsObjectForProps(wallet, rewardschainsMap));
    }
  }, [rewardschainsMap]);

  return (
    <Container>
      {data?.chains?.length > 0 ? (
        <>
          <StakingTotal
            totalAmount={data.totalAmount}
            totalReward={rewardData.totalReward}
          />
          {data.chains.map((chain) => (
            <Chain
              chain={chain}
              key={chain.chainName}
              chainReward={rewardData?.[chain.chainName]}
            />
          ))}
        </>
      ) : (
        <>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                sx={{
                  mt: 4,
                }}
              />
            </Box>
          ) : (
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
              }}
            >
              No delegations
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};
export default StakingOverview;
