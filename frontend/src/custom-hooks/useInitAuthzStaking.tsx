import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useAddressConverter from './useAddressConverter';
import useGetChainInfo from './useGetChainInfo';
import {
  getAuthzDelegations,
  getAuthzUnbonding,
} from '@/store/features/staking/stakeSlice';
import { getAuthzDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import { getAuthzBalances } from '@/store/features/bank/bankSlice';

const useInitAuthzStaking = (chainIDs: string[]) => {
  const dispatch = useAppDispatch();
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

  const { convertAddress } = useAddressConverter();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  useEffect(() => {
    if (authzAddress) {
      chainIDs.forEach((chainID) => {
        const { baseURL, restURLs } = getChainInfo(chainID);
        const { minimalDenom } = getDenomInfo(chainID);
        const address = convertAddress(chainID, authzAddress);
        dispatch(
          getAuthzDelegations({
            baseURLs: restURLs,
            address,
            chainID,
          })
        );
        dispatch(
          getAuthzUnbonding({
            baseURLs: restURLs,
            address,
            chainID,
          })
        );
        dispatch(
          getAuthzDelegatorTotalRewards({
            baseURL,
            address,
            chainID,
            denom: minimalDenom,
            baseURLs: restURLs,
          })
        );
        dispatch(
          getAuthzBalances({
            baseURLs: restURLs,
            baseURL,
            address,
            chainID,
          })
        );
      });
    }
  }, [authzAddress]);
};

export default useInitAuthzStaking;
