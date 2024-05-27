import React, { useEffect, useState } from 'react';
import SingleTransfer from './SingleTransfer';
import useInitBalances from '@/custom-hooks/useInitBalances';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import { useSearchParams } from 'next/navigation';

const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const [sortedAssets, authzSortedAssets] = useSortedAssets(chainIDs, {
    showAvailable: true,
    AuthzSkipIBC: true,
  });
  const paramsTransferType = useSearchParams().get('type');

  const [transferType, setTransferType] = useState('single');

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  useInitBalances({ chainIDs });

  useEffect(() => {
    if (paramsTransferType?.length) {
      setTransferType(paramsTransferType.toLowerCase());
    } else {
      setTransferType('single');
    }
  }, [paramsTransferType]);

  return (
    <div className="h-full">
      {transferType === 'single' ? (
        <SingleTransfer
          sortedAssets={isAuthzMode ? authzSortedAssets : sortedAssets}
          chainIDs={chainIDs}
        />
      ) : null}
    </div>
  );
};

export default TransfersPage;
