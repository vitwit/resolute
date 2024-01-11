import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useAddressConverter from './useAddressConverter';
import { getAuthzBalances } from '@/store/features/bank/bankSlice';
import {
  getAuthzDelegations,
  getAuthzUnbonding,
} from '@/store/features/staking/stakeSlice';
import { getAuthzDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';

const useInitAuthzForOverview = (chainIDs: string[]) => {
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const networks = useAppSelector((state) => state.wallet.networks);
  const { convertAddress } = useAddressConverter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authzAddress) {
      chainIDs.forEach((chainID) => {
        const allChainInfo = networks[chainID];
        const chainInfo = allChainInfo.network;
        const address = convertAddress(chainID, authzAddress);
        const minimalDenom =
          allChainInfo.network.config.stakeCurrency.coinMinimalDenom;
        const basicChainInputs = {
          baseURL: chainInfo.config.rest,
          address,
          chainID,
        };

        dispatch(getAuthzBalances(basicChainInputs));
        dispatch(getAuthzDelegations(basicChainInputs));
        dispatch(
          getAuthzDelegatorTotalRewards({
            baseURL: chainInfo.config.rest,
            address: address,
            chainID: chainID,
            denom: minimalDenom,
          })
        );
        dispatch(
          getAuthzUnbonding({
            baseURL: chainInfo.config.rest,
            address: address,
            chainID,
          })
        );
      });
    }
  }, [authzAddress]);
};

export default useInitAuthzForOverview;
