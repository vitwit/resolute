'use client';
import TopNav from '@/components/TopNav';
import Image from 'next/image';
import React from 'react';
import TxnBuilder from '../components/TxnBuilder';

const PageMultiops = ({ chainName }: { chainName: string }) => {
  return (
    <div className="h-screen flex flex-col p-6 px-10 gap-10">
      <div className="w-full flex justify-between">
        <h2 className="text-[20px] leading-normal font-normal">Multiops</h2>
        <TopNav />
      </div>
      <div className="rounded-2xl bg-[#1a1731] p-10 h-full">
        <TxnBuilder />
      </div>
    </div>
  );
};

export default PageMultiops;
