'use client';
import TopNav from '@/components/TopNav';
import React from 'react';

const Multisig = () => {
  return (
    <div className="h-screen flex flex-col p-6 pl-10">
      <div className="w-full flex justify-between">
        <h2 className="text-[20px] leading-normal font-normal">Multisig</h2>
        <TopNav />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center gap-1">
        <p>All Networks page is not supported for Multisig.</p>
        <p>Please select a network.</p>
      </div>
    </div>
  );
};

export default Multisig;
