import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { getTxnURL } from '@/utils/util';
import Link from 'next/link';
import React from 'react';

const ActionButtonsGroup = ({
  explorer,
  txHash,
}: {
  explorer: string;
  txHash: string;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex gap-10 mt-6">
      <button
        className="txn-receipt-btn"
        onClick={() => {
          copyToClipboard(getTxnURL(explorer, txHash || ''));
          dispatch(setError({ type: 'success', message: 'Copied' }));
        }}
      >
        Share
      </button>
      <Link
        className="txn-receipt-btn"
        href={getTxnURL(explorer, txHash || '')}
        target="_blank"
      >
        View
      </Link>
    </div>
  );
};

export default ActionButtonsGroup;
