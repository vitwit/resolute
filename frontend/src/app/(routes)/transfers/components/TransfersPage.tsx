import React, { useEffect, useState } from 'react';
import SingleTransfer from './SingleTransfer';
import useInitBalances from '@/custom-hooks/useInitBalances';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import { useSearchParams } from 'next/navigation';
import MultiSendPage from './multi-send/MultiSendPage';

const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
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
        />
      ) : null}
      {transferType === 'multi-send' ? (
        <MultiSendPage chainID={chainIDs[0]} />
      ) : null}
    </div>
  );
};

export default TransfersPage;
