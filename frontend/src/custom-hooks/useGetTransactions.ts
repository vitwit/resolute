import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './StateHooks';
import { getAllTransactions } from '@/store/features/recent-transactions/recentTransactionsSlice';
import useGetChainInfo from './useGetChainInfo';

const useGetTransactions = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);
  const txns = useAppSelector((state) => state.recentTransactions.txns.data);
  useEffect(() => {
    dispatch(
      getAllTransactions({
        address,
        chainID,
        limit: 5,
        offset: 0,
      })
    );
  }, []);
  const getTransactions = () => {
    return {
      txns,
    };
  };

  const fetchTransactions = (limit: number, offset: number) => {
    dispatch(
      getAllTransactions({
        address,
        chainID,
        limit: limit,
        offset: offset,
      })
    );
  };
  return { getTransactions, fetchTransactions };
};

export default useGetTransactions;
