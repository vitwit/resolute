import { useEffect } from 'react';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getAuthzDelegations,
  getAuthzUnbonding,
  getDelegations,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';
import {
  getAuthzDelegatorTotalRewards,
  getDelegatorTotalRewards,
} from '@/store/features/distribution/distributionSlice';
import { getAuthzBalances, getBalances } from '@/store/features/bank/bankSlice';
import { useAppDispatch, useAppSelector } from '../StateHooks';
import useAddressConverter from '../useAddressConverter';
import useGetChainInfo from '../useGetChainInfo';
import useFetchPriceInfo from '../useFetchPriceInfo';
import useInitFeegrant from '../useInitFeegrant';
import useInitAuthz from '../useInitAuthz';

/* eslint-disable react-hooks/rules-of-hooks */
const useInitApp = () => {
  const dispatch = useAppDispatch();
  const { convertAddress } = useAddressConverter();

  const isFeegrantModeEnabled = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.values(nameToChainIDs);

  const isWalletConnected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );

  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  useEffect(() => {
    if (chainIDs.length > 0 && isWalletConnected) {
      chainIDs.forEach((chainID) => {
        const { address, baseURL, restURLs } = getChainInfo(chainID);
        const { minimalDenom } = getDenomInfo(chainID);
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

        dispatch(getAllValidators({ baseURLs: restURLs, chainID }));
      });
    }
  }, [isWalletConnected, isAuthzMode]);

  useFetchPriceInfo();
  useInitFeegrant({ chainIDs, shouldFetch: isFeegrantModeEnabled });
  useInitAuthz({ chainIDs, shouldFetch: isAuthzMode });
};

export default useInitApp;
