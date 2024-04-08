import { useEffect } from 'react';
import { useAppDispatch} from './StateHooks';
import useGetChainInfo from './useGetChainInfo';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/feegrant/feegrantSlice';

/**
 * This custom hook is used to dispatch the feegrantsByMe and feegrantsToMe
 *
 */
const useInitFeegrant = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
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
