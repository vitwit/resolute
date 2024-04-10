import TopNav from '@/components/TopNav';
import React, { useState } from 'react';
import Transaction from './Transaction';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { Pagination } from '@mui/material';
import { paginationComponentStyles } from '../../staking/styles';

const PageTxnHistory = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[chainName];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { getTransactions, fetchTransactions } = useGetTransactions({
    chainID,
  });
  const { txns } = getTransactions();

  const handlePageChange = (value: number) => {
    const offset = (value - 1) * itemsPerPage;
    fetchTransactions(itemsPerPage, offset);
    setCurrentPage(value);
  };

  const totalCount = useAppSelector(
    (state) => state.recentTransactions?.txns?.total
  );

  return (
    <div className="py-6 px-10 h-screen space-y-10">
      <div className="flex justify-between">
        <h2 className="text-[20px] leading-normal font-normal">
          Transaction History
        </h2>
        <TopNav />
      </div>
      <div className="space-y-2">
        {txns?.map((txn) => (
          <Transaction
            txn={txn}
            key={txn.txhash}
            currency={currency}
            basicChainInfo={basicChainInfo}
          />
        ))}
      </div>
      <div>
        <Pagination
          sx={paginationComponentStyles}
          count={Math.ceil(totalCount / itemsPerPage)}
          page={currentPage}
          shape="circular"
          onChange={(_, value) => {
            handlePageChange(value);
          }}
        />
      </div>
    </div>
  );
};

export default PageTxnHistory;
