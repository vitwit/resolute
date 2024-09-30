import { useAppDispatch, useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import useGetChainInfo from './useGetChainInfo';
import { getParams, getValidator } from '@/store/features/staking/stakeSlice';
import useGetAssetsAmount from './useGetAssetsAmount';
import { useEffect } from 'react';

/* eslint-disable react-hooks/rules-of-hooks */
const useSingleStaking = (chainID: string) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const {
    getChainInfo,
    getDenomInfo,
    //  getValueFromToken, getTokenValueByChainId
  } = useGetChainInfo();

  const { restURLs } = getChainInfo(chainID);

  useEffect(() => {
    dispatch(getParams({ chainID: chainID, baseURLs: restURLs }))
  }, [chainID])

  const rewardsChains = useAppSelector((state: RootState) =>
    isAuthzMode ? state.distribution.authzChains : state.distribution.chains
  );



  // const totalData = useAppSelector((state: RootState) => state.staking)

  const [
    totalStakedAmount,
    availableAmount,
    rewardsAmount,
    totalUnStakedAmount,
  ] = useGetAssetsAmount([chainID]);

  // const { getTokensByChainID } = useGetAssets();

  // get total staking data data from the  state
  const stakeData = useAppSelector((state: RootState) =>
    isAuthzMode ? state.staking.authz.chains : state.staking.chains
  );
  const bankData = useAppSelector((state: RootState) =>
    isAuthzMode ? state.bank.authz.balances : state.bank.balances
  );
  const commonStakingData = useAppSelector((state) => state.staking.chains);

  const getChainUnbondingPeriod = (cID: string) => {
    const secs = stakeData[cID].params?.unbonding_time || ''

    // Use regex to match all digits in the string
    const numberInString = secs.match(/\d+/);

    // If a number is found, convert to seconds and then to days
    if (numberInString) {
      const seconds = parseInt(numberInString[0], 10);
      const days = seconds / 86400;
      return days;
    }

    return 21
  }

  const getAvaiailableAmount = (chainID: string) => {
    let amount = 0;

    const { decimals, minimalDenom } = getDenomInfo(chainID);

    bankData[chainID]?.list?.forEach((element) => {
      if (element?.denom === minimalDenom) amount += Number(element?.amount);
    });

    return Number(amount / 10 ** decimals);
  };

  const totalValStakedAssets = (chainID: string, valAddr: string) => {
    let amount = 0;
    stakeData[chainID]?.delegations?.delegations?.delegation_responses?.forEach(
      (d) => {
        if (d?.delegation?.validator_address === valAddr) {
          amount = Number(d?.balance?.amount);
        }
      }
    );

    const { decimals } = getDenomInfo(chainID);
    return Number(amount / 10 ** decimals);
  };

  const fetchValidatorDetails = (valoperAddress: string, chainID: string) => {
    const { restURLs } = getChainInfo(chainID);
    dispatch(
      getValidator({
        baseURLs: restURLs,
        chainID,
        valoperAddress: valoperAddress,
      })
    );
  };

  const chainLogo = (chainID: string) =>
    networks[chainID]?.network?.logos?.menu || '';

  const getStakingAssets = () => {
    return {
      totalStakedAmount,
      rewardsAmount,
      totalUnStakedAmount,
      availableAmount,
    };
  };

  const getAllDelegations = (chainID: string) => {
    return { [chainID]: stakeData[chainID] };
  };

  // Get total staked amount of chain

  const getAmountWithDecimal = (amount: number, chainID: string) => {
    const { decimals, displayDenom } = getDenomInfo(chainID);

    return (
      (amount / 10 ** decimals).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }) +
      ' ' +
      displayDenom
    );
  };

  const getDenomWithChainID = (chainID: string) => {
    const { displayDenom } = getDenomInfo(chainID);

    return displayDenom;
  };

  const chainTotalRewards = (chainID: string) => {
    let totalRewardsAmount = 0;
    let displayDenomName = '';
    const rewards =
      rewardsChains?.[chainID]?.delegatorRewards?.totalRewards || 0;

    const { decimals, displayDenom } = getDenomInfo(chainID);
    if (rewards > 0) {
      totalRewardsAmount += rewards / 10 ** decimals;
    }

    displayDenomName = displayDenom;

    return totalRewardsAmount.toFixed(4) + ' ' + displayDenomName;
  };

  const getValidators = () => {
    return commonStakingData[chainID]?.validators || {};
  };

  return {
    getStakingAssets,
    getAllDelegations,
    fetchValidatorDetails,
    getAmountWithDecimal,
    chainTotalRewards,
    chainLogo,
    getValidators,
    getDenomWithChainID,
    getAvaiailableAmount,
    totalValStakedAssets,
    getChainUnbondingPeriod
  };
};

export default useSingleStaking;
