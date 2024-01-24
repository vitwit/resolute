import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import useGetChainInfo from './useGetChainInfo';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/feegrant/feegrantSlice';

/**
 * This custom hook is used to dispatch the feegrantsByMe and feegrantsToMe
 *
 */
const useInitFeegrant = () => {
  const networks = useAppSelector((state) => state.wallet.networks);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getChainInfo } = useGetChainInfo();
  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { address, baseURL, restURLs } = getChainInfo(chainID);
      const feegrantInputs = {
        baseURLs: restURLs,
        address,
        baseURL,
        chainID,
      };
      dispatch(getGrantsByMe(feegrantInputs));
      dispatch(getGrantsToMe(feegrantInputs));
    });
  }, []);
};

export default useInitFeegrant;
