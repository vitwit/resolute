import { useEffect, useRef } from 'react';
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
import { getAuthzAlertData, isAuthzAlertDataSet } from '@/utils/localStorage';

const fetchAuthz = (isAuthzMode: boolean): boolean => {
  if (isAuthzMode) {
    return true;
  }
  if (
    !isAuthzMode &&
    ((isAuthzAlertDataSet() && getAuthzAlertData()) || !isAuthzAlertDataSet())
  ) {
    return true;
  }
  return false;
};

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

  const walletState = useAppSelector((state) => state.wallet);
  const isWalletConnected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const fetchedChains = useRef<{ [key: string]: boolean }>({});
  const validatorsFetchedChains = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (chainIDs.length > 0 && isWalletConnected) {
      ['passage-2'].forEach((chainID) => {
        if (!fetchedChains.current[chainID]) {
          const { address, baseURL, restURLs } = getChainInfo(chainID);

          if (isWalletConnected && address.length) {
            const authzGranterAddress = convertAddress(chainID, authzAddress);
            const { minimalDenom } = getDenomInfo(chainID);
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
            );

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

            // Mark chain as fetched
            fetchedChains.current[chainID] = true;
          }
        }
      });
    }
  }, [
    isWalletConnected,
    isAuthzMode,
    chainIDs,
    getChainInfo,
    convertAddress,
    getDenomInfo,
    authzAddress,
    dispatch,
    walletState,
  ]);

  useEffect(() => {
    if (chainIDs.length > 0) {
      chainIDs.forEach((chainID) => {
        const { restURLs } = getChainInfo(chainID);
        if (restURLs?.length && !validatorsFetchedChains.current[chainID]) {
          // Fetch validators
          dispatch(getAllValidators({ baseURLs: restURLs, chainID }));

          // Mark chain as fetched
          validatorsFetchedChains.current[chainID] = true;
        }
      });
    }
  }, [chainIDs, walletState]);

  useFetchPriceInfo();
  useInitFeegrant({ chainIDs, shouldFetch: isFeegrantModeEnabled });
  useInitAuthz({ chainIDs, shouldFetch: fetchAuthz(isAuthzMode) });
};

export default useInitApp;
