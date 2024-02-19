import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useGetChainInfo from './useGetChainInfo';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
import { getBalances } from '@/store/features/bank/bankSlice';

const useInitAllValidator = () => {
  const networks = useAppSelector((state) => state.wallet.networks);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getChainInfo } = useGetChainInfo();
  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { restURLs, baseURL, address } = getChainInfo(chainID);
      dispatch(
        getAllValidators({
          baseURLs: restURLs,
          chainID: chainID,
        })
      );
      dispatch(
        getBalances({
          baseURLs: restURLs,
          baseURL,
          address,
          chainID,
        })
      );
    });
  }, []);
};

export default useInitAllValidator;
