import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useAddressConverter from './useAddressConverter';
import useGetChainInfo from './useGetChainInfo';
import {
  getAuthzDelegations,
  getAuthzUnbonding,
  getAuthzValidator,
} from '@/store/features/staking/stakeSlice';
import {
  getAuthzDelegatorTotalRewards,
  getAuthzWithdrawAddress,
} from '@/store/features/distribution/distributionSlice';
import { getAuthzBalances } from '@/store/features/bank/bankSlice';
import { getAddressByPrefix } from '@/utils/address';

const useInitAuthzStaking = (chainIDs: string[]) => {
  const dispatch = useAppDispatch();
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

  const { convertAddress } = useAddressConverter();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  useEffect(() => {
    if (authzAddress) {
      chainIDs.forEach((chainID) => {
        const { baseURL, restURLs, valPrefix } = getChainInfo(chainID);
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
        dispatch(
          getAuthzValidator({
            baseURLs: restURLs,
            chainID,
            valoperAddress: getAddressByPrefix(address, valPrefix),
          })
        );
        dispatch(
          getAuthzWithdrawAddress({
            baseURLs: restURLs,
            chainID,
            delegator: address,
          })
        );
      });
    }
  }, [authzAddress]);
};

export default useInitAuthzStaking;
