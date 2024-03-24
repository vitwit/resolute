'use client';
import TopNav from '@/components/TopNav';
import Image from 'next/image';
import React from 'react';

const Multiops = () => {
  const message =
    'All Networks page is not supported for Multiops, Please select a network.';
  return (
    <div className="h-screen flex flex-col p-6 pl-10">
      <div className="w-full flex justify-between">
        <h2 className="text-[20px] leading-normal font-normal">Multiops</h2>
        <TopNav message={message} />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <Image
          src="/no-multisigs.png"
          width={400}
          height={235}
          alt={'No Transactions'}
          draggable={false}
        />
        <p>{message}</p>
        <button
          className="primary-custom-btn"
          onClick={() => {
            document.getElementById('select-network')!.click();
          }}
        >
          Select Network
        </button>
      </div>
    </div>
  );
};

export default Multiops;
