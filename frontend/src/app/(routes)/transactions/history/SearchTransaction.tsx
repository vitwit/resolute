import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getAnyChainTransaction } from '@/store/features/recent-transactions/recentTransactionsSlice';
import React, { useEffect, useState } from 'react';
import SearchTransactionHash from './[network]/components/SearchTransactionHash';
import { TxStatus } from '@/types/enums';
import { parseTxnData } from '@/utils/util';
import Transaction from './[network]/components/Transaction';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { CircularProgress } from '@mui/material';

const SearchTransaction = () => {
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) dispatch(getAnyChainTransaction({ txhash: searchQuery }));
  };

  const loading = useAppSelector(
    (state) => state.recentTransactions.txn?.status
  );

  const txnResult = useAppSelector(
    (state) => state.recentTransactions.txn?.data?.[0]
  );
  const txnStatus = useAppSelector(
    (state) => state.recentTransactions.txn.status
  );
  const { txHash = '' } = txnResult ? parseTxnData(txnResult) : {};

  const [chainID, setChainID] = useState('');
  const { chainName } = getChainInfo(chainID);

  useEffect(() => {
    if (txnResult) {
      setChainID(txnResult.chain_id);
    }
  }, [txnResult]);

  return (
    <div className="w-full">
      <form onSubmit={onSearch} className="flex gap-6 items-center">
        <SearchTransactionHash
          searchQuery={searchQuery}
          handleSearchQueryChange={handleSearchQueryChange}
          handleClearSearch={handleClearSearch}
        />
        <button type="submit" className="primary-btn">
          Search
        </button>
      </form>

      {loading === TxStatus.PENDING ? (
        <div className="flex-center-center gap-2 my-[25%]">
          <CircularProgress sx={{ color: 'white' }} size={18} />
          <div className="italic font-extralight text-[14px]">
            Fetching transaction info <span className="dots-flashing"></span>
          </div>
        </div>
      ) : (
        <>
          {txnResult && chainID && chainName ? (
            <Transaction
              hash={txHash}
              chainName={chainName}
              chainID={chainID}
              isSearchPage
            />
          ) : null}
        </>
      )}
      {txnStatus === TxStatus.REJECTED ? <TransactionNotFound /> : null}
    </div>
  );
};

export default SearchTransaction;

const TransactionNotFound = () => {
  const txSearchError = useAppSelector(
    (state) => state.recentTransactions.txn.error
  );

  if (txSearchError)
    return (
      <div className="w-full my-[25%]">
        <p className="text-h2 font-bold w-fit mx-auto">
          Sorry, the transaction you&apos;re looking for is not found.
        </p>
      </div>
    );
  return <></>;
};
