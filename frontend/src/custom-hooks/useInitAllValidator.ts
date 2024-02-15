import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useGetChainInfo from './useGetChainInfo';
import { getAllValidators } from '@/store/features/staking/stakeSlice';

const useInitAllValidator = () => {
  const networks = useAppSelector((state) => state.wallet.networks);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getChainInfo } = useGetChainInfo();
  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { restURLs } = getChainInfo(chainID);
      dispatch(
        getAllValidators({
          baseURLs: restURLs,
          chainID: chainID,
        })
      );
    });
  }, []);
};

export default useInitAllValidator;
