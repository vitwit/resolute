import React from 'react';
import Image from 'next/image';
import messages from '@/utils/messages.json';

const NoTransactions = () => {
  return (
    <div className="flex flex-col flex-1 items-center">
      <Image
        src="/no-transactions-illustration.png"
        width={200}
        height={200}
        alt="no transactions"
      />
      <div className="mt-2 text-white text-center text-base italic font-extralight leading-[normal] flex flex-1 justify-center">
        {messages.noTransactions}
      </div>
    </div>
  );
};

export default NoTransactions;
