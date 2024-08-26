
import React, { useState } from 'react';
import SearchTransactionHash from './SearchTransactionHash';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getTypeURLName } from '@/utils/util';

const TransactionHistoryDashboard = ({ chainID }: { chainID: string }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useGetTransactions({ chainID })

  const transactions = useAppSelector((state: RootState) => state.recentTransactions.txns?.data)
  console.log('statke data', transactions)


  // const transactions = [
  //   {
  //     date: '23rd March 2024',
  //     hash: '9EE7829FA411244...',
  //     amount: '1000 AKT',
  //     recipient: 'pasg1h3v5dv7',
  //     statusIcon: '/success-icon.svg',
  //     status: 'success',
  //     permissions: ['Send', 'Delegate', 'Vote'],
  //   },
  //   {
  //     date: '21st March 2024',
  //     hash: '8FE7829FA411244...',
  //     amount: '500 AKT',
  //     recipient: 'pasg2j4k8nd92',
  //     statusIcon: '/success-icon.svg',
  //     status: 'success',
  //     permissions: ['Send', 'Delegate'],
  //   },
  //   {
  //     date: '20th March 2024',
  //     hash: '7CE8829FA411244...',
  //     amount: '200 AKT',
  //     recipient: 'pasg9x7v3fb9k',
  //     statusIcon: '/failed-icon.svg',
  //     status: 'failed',
  //     permissions: [
  //       'Send',
  //       'Send',
  //       'Vote',
  //       'Delegate',
  //       'Manage',
  //       'Send',
  //       'Vote',
  //       'Delegate',
  //       'Manage',
  //     ],
  //   },
  //   {
  //     date: '19th March 2024',
  //     hash: '6BD7829FA411244...',
  //     amount: '1500 AKT',
  //     recipient: 'pasg6z8h2v1qp',
  //     statusIcon: '/failed-icon.svg',
  //     status: 'failed',
  //     permissions: ['Send', 'Vote', 'Delegate', 'Manage'],
  //   },
  //   {
  //     date: '18th March 2024',
  //     hash: '5AC7829FA411244...',
  //     amount: '800 AKT',
  //     recipient: 'pasg4g5j9d6z',
  //     statusIcon: '/success-icon.svg',
  //     status: 'success',
  //     permissions: ['Delegate', 'Vote'],
  //   },
  // ];



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
                <p className="text-small">{txn?.timestamp || '-'}</p>
                <p className="v-line"></p>
                <Image
                  src={txn?.code === 0 ? '/success-icon.svg' : '/failed-icon.svg'}
                  width={24}
                  height={24}
                  alt="status-icon"
                />
                <p className="v-line"></p>
              </div>

              <div className="txn-card flex-1">
                <div className="space-y-6 w-[30%]">
                  <div className="flex">
                    <p className="text-b1">{txn?.txhash}</p>
                    <Copy content={txn?.txhash} />
                  </div>
                  <div>
                    <span className="text-small">Sent</span>{' '}
                    {/* <span className="text-b1">{txn.amount}</span>{' '} */}
                    <span className="text-small">to </span>{' '}
                    {/* <span className="text-b1">{txn.recipient}</span> */}
                  </div>
                </div>
                <br/>
                <br/>
                <div className="flex flex-wrap gap-4 w-[50%]">
                  {
                    txn?.messages?.map((msg, index) => (
                      <div key={index} className="txn-permission-card">
                        <span className="text-b1">{getTypeURLName(msg?.['@type'])}</span>
                      </div>
                    ))
                  }
                  {/* <>
                    {txn.permissions.map((permission, index) => (
                     
                    ))} 
                  </>*/}
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