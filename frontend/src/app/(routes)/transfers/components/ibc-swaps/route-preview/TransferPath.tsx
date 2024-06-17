import Image from 'next/image';
import React from 'react';

const TransferPath = ({
  fromLogo,
  fromName,
  toLogo,
  toName,
  tokenLogo,
  tokenSymbol,
}: {
  tokenLogo: string;
  tokenSymbol: string;
  fromLogo: string;
  fromName: string;
  toLogo: string;
  toName: string;
}) => {
  return (
    <div className="flex gap-2 flex-wrap bg-[#ffffff0d] p-2 rounded-xl text-[14px]">
      <div className="opacity-50">Transfer</div>
      <div className="flex-center-center gap-1">
        <Image src={tokenLogo} width={16} height={16} alt="" />
        <span className="font-semibold uppercase">{tokenSymbol}</span>
      </div>
      <div className="opacity-50">from</div>
      <div className="flex-center-center gap-1">
        <Image src={fromLogo} width={16} height={16} alt="" />
        <span className="font-semibold capitalize">{fromName}</span>
      </div>
      <div className="opacity-50">to</div>
      <div className="flex-center-center gap-1">
        <Image src={toLogo} width={16} height={16} alt="" />
        <span className="font-semibold capitalize">{toName}</span>
      </div>
    </div>
  );
};

export default TransferPath;
