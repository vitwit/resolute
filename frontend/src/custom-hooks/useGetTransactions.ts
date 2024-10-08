import { useAppDispatch, useAppSelector } from './StateHooks';
import {
  getAllTransactions,
  getTransaction,
} from '@/store/features/recent-transactions/recentTransactionsSlice';
import useGetChainInfo from './useGetChainInfo';

const useGetTransactions = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);
  const txns = useAppSelector((state) => state.recentTransactions.txns.data);
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

  const fetchTransaction = (txhash: string) => {
    if (chainID) {
      dispatch(
        getTransaction({
          address,
          chainID,
          txhash,
        })
      );
    }
  };

  return { getTransactions, fetchTransactions, fetchTransaction };
};

export default useGetTransactions;
