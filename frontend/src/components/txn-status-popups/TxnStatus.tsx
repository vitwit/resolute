import React from 'react';
import ShareTxn from './ShareTxn';
import { getTxnURL } from '@/utils/util';
import Link from 'next/link';
import Image from 'next/image';
import { REDIRECT_ICON } from '@/constants/image-names';

const TxnStatus = ({
  explorer,
  txHash,
  txSuccess,
}: {
  txSuccess: boolean;
  explorer: string;
  txHash: string;
}) => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="text-h2 !font-bold">
        {txSuccess ? (
          <span>Transaction Successful</span>
        ) : (
          <span>Transaction Failed</span>
        )}
      </div>
      <ShareTxn content={getTxnURL(explorer, txHash || '')} />
      <Link
        className="txn-receipt-btn"
        href={getTxnURL(explorer, txHash || '')}
        target="_blank"
      >
        <Image src={REDIRECT_ICON} width={26} height={26} alt="" />
      </Link>
    </div>
  );
};

export default TxnStatus;