import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import {
  getProposalsInDeposit,
  getProposalsInVoting,
} from '@/store/features/gov/govSlice';

const useInitGovernance = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const walletState = useAppSelector((state) => state.wallet.status)

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const {
        address,
        baseURL,
        restURLs: baseURLs,
        govV1,
      } = getChainInfo(chainID);
      dispatch(
        getProposalsInVoting({
          baseURL,
          baseURLs,
          chainID,
          govV1,
          voter: address,
        })
      );
      dispatch(
        getProposalsInDeposit({
          baseURL,
          baseURLs,
          chainID,
          govV1,
        })
      );
    });
  }, [chainIDs, walletState]);
};

export default useInitGovernance;
