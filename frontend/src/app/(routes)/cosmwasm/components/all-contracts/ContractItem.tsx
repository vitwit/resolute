import Copy from '@/components/common/Copy';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ContractItem = ({
  contract,
  chainLogo,
}: {
  contract: string;
  chainLogo: string;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Image
          src={chainLogo}
          width={24}
          height={24}
          alt="logo"
          className="w-6 h-6"
        />
        <div className="flex items-center gap-2">
          <p className="text-b1">{contract}</p>
          <Copy content={contract} />
        </div>
      </div>
      <div className="flex gap-6">
        <Link href={`?contract=${contract}`}>
          <button className="primary-btn">Execute</button>
        </Link>
        <Link href={`?contract=${contract}`}>
          <button className="primary-btn">Query</button>
        </Link>
      </div>
    </div>
  );
};

export default ContractItem;
