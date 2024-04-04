import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { getRecentTransactions } from '@/store/features/recent-transactions/recentTransactionsSlice';
import useGetChainInfo from './useGetChainInfo';

const useGetTransactions = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getAllChainAddresses } = useGetChainInfo();
  const txns = useAppSelector((state) => state.recentTransactions.txns.data);
  useEffect(() => {
    dispatch(
      getRecentTransactions({
        addresses: getAllChainAddresses([chainID]),
        module: 'all',
      })
    );
  }, []);
  const getTransactions = () => {
    return {
      txns,
    };
  };
  return { getTransactions };
};

export default useGetTransactions;
