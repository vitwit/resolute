
import React, { useState } from 'react';
import SearchTransactionHash from './SearchTransactionHash';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getTypeURLName } from '@/utils/util';
import NewTxnMsg from '@/components/NewTxnMsg';
import { getLocalTime } from '@/utils/dataTime';
import Link from 'next/link';

const TransactionHistoryDashboard = ({ chainID }: { chainID: string }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useGetTransactions({ chainID })

  const transactions = useAppSelector((state: RootState) => state.recentTransactions.txns?.data)
  console.log('statke data', transactions)

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const config = networks?.[chainID]?.network?.config;
  const currency = config?.currencies?.[0];

  return (
    <>
      <div className="flex flex-col py-10 gap-10">

        <div className="px-6">
          <SearchTransactionHash
            searchQuery={searchQuery}
            handleSearchQueryChange={handleSearchQueryChange}
          />
        </div>
        <div className="flex flex-col gap-6 px-6">
          {transactions.map((txn, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex flex-col items-center gap-2">
                <p className="text-small">{getLocalTime(txn?.timestamp)}</p>
                <p className="v-line"></p>
                <Image
                  src={txn?.code === 0 ? '/success-icon.svg' : '/failed-icon.svg'}
                  width={24}
                  height={24}
                  alt="status-icon"
                />
                <p className="v-line"></p>
              </div>

              <div className="txn-card flex-1 gap-10">
                <div className="space-y-6 ">
                  <div className="flex">
                    <Link
                      className="capitalize"
                      href={`history/${txn?.txhash}`}
                    >
                      <p className="text-b1">{txn?.txhash}</p>
                      <Copy content={txn?.txhash} />
                    </Link>

                  </div>
                  <div className=''>
                    <NewTxnMsg msgs={txn?.messages || []} currency={currency} failed={txn?.code !== 0} />
                  </div>
                </div>
                <br />
                <br />
                <div className="flex flex-wrap gap-4 w-[50%]">
                  {
                    txn?.messages?.map((msg, index) => (
                      <div key={index} className="txn-permission-card">
                        <span className="text-b1">{getTypeURLName(msg?.['@type'])}</span>
                      </div>
                    ))
                  }
                </div>
                <div className="flex">
                  <button className="primary-btn">
                    {txn?.code === 0 ? 'Retry' : 'Repeat'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionHistoryDashboard;