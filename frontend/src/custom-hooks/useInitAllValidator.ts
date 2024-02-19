import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { getAllValidators } from '@/store/features/staking/stakeSlice';
import useGetAllChainsInfo from './useGetAllChainsInfo';

const useInitAllValidator = () => {
  const networks = useAppSelector((state) => state.common.allNetworksInfo);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getAllChainInfo } = useGetAllChainsInfo();

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { restURLs } = getAllChainInfo(chainID);
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
