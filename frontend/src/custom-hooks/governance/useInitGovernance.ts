import { useEffect } from 'react';
import { useAppDispatch } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import {
  getProposalsInDeposit,
  getProposalsInVoting,
} from '@/store/features/gov/govSlice';

const useInitGovernance = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();

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
  }, [chainIDs]);
};

export default useInitGovernance;
