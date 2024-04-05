import { useEffect } from 'react';
import { useAppDispatch } from './StateHooks';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/authz/authzSlice';
import useGetChainInfo from './useGetChainInfo';

const useInitAuthz = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
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

export default useInitAuthz;
