import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import {
  getProposalsInDeposit,
  getProposalsInVoting,
} from '@/store/features/gov/govSlice';

const useInitGovernance = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const walletState = useAppSelector((state) => state.wallet.status);
  const fetchedChains = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      if (!fetchedChains.current[chainID]) {
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
        fetchedChains.current[chainID] = true;
      }
    });
  }, [chainIDs, walletState]);
};

export default useInitGovernance;
