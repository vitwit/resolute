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
        const { baseURL } = getChainInfo(chainID);
        const { minimalDenom } = getDenomInfo(chainID);
        const address = convertAddress(chainID, authzAddress);
        dispatch(
          getAuthzDelegations({
            baseURL,
            address,
            chainID,
          })
        );
        dispatch(
          getAuthzUnbonding({
            baseURL,
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
          })
        );
        dispatch(
          getAuthzBalances({
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
