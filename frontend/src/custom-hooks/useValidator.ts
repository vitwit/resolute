import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import useGetChainInfo from './useGetChainInfo';
import { getValidator } from '@/store/features/staking/stakeSlice';

const useValidator = () => {
  const dispatch = useAppDispatch();

  const isWalletConnected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );
  const { getChainInfo } = useGetChainInfo();
  const stakeData = useAppSelector((state: RootState) => state.staking.chains);

  const fetchValidator = useCallback(
    (valoperAddress: string, chainID: string) => {
      if (isWalletConnected && valoperAddress && chainID) {
        const { restURLs } = getChainInfo(chainID);
        console.log(
          'staking------',
          stakeData[chainID]?.validator[valoperAddress]
        );
        if (
          ![
            ...stakeData[chainID]?.validators?.activeSorted,
            ...stakeData[chainID]?.validators?.inactiveSorted,
          ].includes(valoperAddress)
        ) {
          if (!stakeData[chainID]?.validator[valoperAddress])
            dispatch(
              getValidator({ baseURLs: restURLs, chainID, valoperAddress })
            );
        }
      }
    },
    []
  );

  const getValidatorDetails = useCallback(
    (valoperAddress: string, chainID: string) => {
      return (
        stakeData[chainID]?.validators.active?.[valoperAddress] ||
        stakeData[chainID]?.validators.inactive?.[valoperAddress] ||
        stakeData[chainID]?.validator?.[valoperAddress]
      );
    },
    [stakeData]
  );

  return {
    fetchValidator,
    getValidatorDetails,
  };
};

export default useValidator;
