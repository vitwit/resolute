import { useEffect } from 'react';
import useGetChainInfo from './useGetChainInfo';
import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  getAllValidators,
  getAuthzDelegations,
  getAuthzUnbonding,
  // getAllValidators,
  getDelegations,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';
import { getAuthzBalances, getBalances } from '@/store/features/bank/bankSlice';
import {
  getAuthzDelegatorTotalRewards,
  getDelegatorTotalRewards,
} from '@/store/features/distribution/distributionSlice';
import useAddressConverter from './useAddressConverter';

const useInitStaking = (chainID: string) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { convertAddress } = useAddressConverter();

  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

  const { address, baseURL, restURLs } = getChainInfo(chainID);
  const { minimalDenom } = getDenomInfo(chainID);

  useEffect(() => {
    if (isWalletConnected) {
      const authzGranterAddress = convertAddress(chainID, authzAddress);
      const chainRequestData = {
        baseURLs: restURLs,
        address: isAuthzMode ? authzGranterAddress : address,
        chainID,
      };

      // Fetch delegations
      dispatch(
        isAuthzMode
          ? getAuthzDelegations(chainRequestData)
          : getDelegations(chainRequestData)
      ).then();

      // Fetch available balances
      dispatch(
        isAuthzMode
          ? getAuthzBalances({ ...chainRequestData, baseURL })
          : getBalances({ ...chainRequestData, baseURL })
      );

      // Fetch rewards
      dispatch(
        isAuthzMode
          ? getAuthzDelegatorTotalRewards({
              ...chainRequestData,
              baseURL,
              denom: minimalDenom,
            })
          : getDelegatorTotalRewards({
              ...chainRequestData,
              baseURL,
              denom: minimalDenom,
            })
      );

      // Fetch unbonding delegations
      dispatch(
        isAuthzMode
          ? getAuthzUnbonding(chainRequestData)
          : getUnbonding(chainRequestData)
      );
    }

    // Fetch all validators
    // if (
    //   isEmpty(stakeData[chainID]?.validators?.active) ||
    //   isEmpty(stakeData[chainID]?.validators?.inactive)
    // )
    dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
  }, [isWalletConnected, chainID, isAuthzMode]);

  // useEffect(() => {
  //   if (chainID) dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
  // }, [chainID]);
};

export default useInitStaking;
