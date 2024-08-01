import { useEffect } from 'react';
import useGetChainInfo from './useGetChainInfo';
import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  // getAllValidators,
  getDelegations,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';
import { getBalances } from '@/store/features/bank/bankSlice';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';

const useInitStaking = (chainID: string) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const { address, baseURL, restURLs } = getChainInfo(chainID);
  const { minimalDenom } = getDenomInfo(chainID);

  useEffect(() => {
    if (isWalletConnected) {
      // Fetch delegations
      dispatch(getDelegations({ baseURLs: restURLs, address, chainID })).then();

      // Fetch available balances
      dispatch(getBalances({ baseURLs: restURLs, baseURL, address, chainID }));

      // Fetch rewards
      dispatch(
        getDelegatorTotalRewards({
          baseURLs: restURLs,
          baseURL,
          address,
          chainID,
          denom: minimalDenom,
        })
      );

      // Fetch unbonding delegations
      dispatch(getUnbonding({ baseURLs: restURLs, address, chainID }));
    }
  }, [isWalletConnected, chainID]);

  // useEffect(() => {
  //   if (chainID) dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
  // }, [chainID]);
};

export default useInitStaking;
