import Image from 'next/image';
import React from 'react';

const SwapPath = ({
  dex,
  fromLogo,
  fromSymbol,
  toLogo,
  toSymbol,
}: {
  fromLogo: string;
  fromSymbol: string;
  toLogo: string;
  toSymbol: string;
  dex: string;
}) => {
  return (
    <div className="flex gap-2 flex-wrap bg-[#ffffff0d] p-2 rounded-xl text-[14px]">
      <div className="opacity-50">Swap</div>
      <div className="flex-center-center gap-1">
        <Image src={fromLogo} width={16} height={16} alt="" />
        <span className="font-semibold uppercase">{fromSymbol}</span>
      </div>
      <div className="opacity-50">for</div>
      <div className="flex-center-center gap-1">
        <Image src={toLogo} width={16} height={16} alt="" />
        <span className="font-semibold uppercase">{toSymbol}</span>
      </div>
      <div className="opacity-50 flex-center-center gap-1">
        <span>on</span>
        <span className="capitalize">{dex}</span>
      </div>
    </div>
  );
};

export default SwapPath;
