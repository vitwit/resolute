import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useGetChainInfo from './useGetChainInfo';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/feegrant/feegrantSlice';

const useInitFeegrant = () => {
  const networks = useAppSelector((state) => state.wallet.networks);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getChainInfo } = useGetChainInfo();
  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { address, baseURL, restURLs } = getChainInfo(chainID);
      const authzInputs = {
        baseURLs: restURLs,
        address,
        baseURL,
        chainID,
      };
      dispatch(getGrantsByMe(authzInputs));
      dispatch(getGrantsToMe(authzInputs));
    });
  }, []);
};

export default useInitFeegrant;
