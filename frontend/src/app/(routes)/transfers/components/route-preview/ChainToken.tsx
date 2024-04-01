import Image from 'next/image';
import React from 'react';

const ChainToken = ({
  amount,
  chainName,
  logo,
  symbol,
}: {
  logo: string;
  amount: string;
  symbol: string;
  chainName: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="border-[1px] border-[#ffffff23] rounded-full p-2 w-fit animate-pulse">
        <Image
          className="rounded-full"
          src={logo}
          width={40}
          height={40}
          alt={chainName}
        />
      </div>
      <div className="space-y-1">
        <div className="font-bold">
          {amount}&nbsp;{symbol}
        </div>
        <div className="font-bold opacity-50">
          On&nbsp;<span className="capitalize">{chainName}</span>
        </div>
      </div>
    </div>
  );
};

export default ChainToken;
