import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  getGrantsByMe,
  getGrantsToMe,
} from '@/store/features/authz/authzSlice';
import useGetChainInfo from './useGetChainInfo';

const useInitAuthz = () => {
  const networks = useAppSelector((state) => state.wallet.networks);
  const dispatch = useAppDispatch();
  const chainIDs = Object.keys(networks);
  const { getChainInfo } = useGetChainInfo();
  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const { address, baseURL } = getChainInfo(chainID);
      const authzInputs = {
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
