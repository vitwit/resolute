import { useEffect } from 'react';
import { useAppDispatch } from './StateHooks';
import { getAllTransactions } from '@/store/features/recent-transactions/recentTransactionsSlice';
import useGetChainInfo from './useGetChainInfo';

const useInitTransactions = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);
  useEffect(() => {
    if (chainID) {
      dispatch(
        getAllTransactions({
          address,
          chainID,
          limit: 5,
          offset: 0,
        })
      );
    }
  }, [chainID]);
};

export default useInitTransactions;
