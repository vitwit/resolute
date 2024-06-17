import React, { useEffect, useState } from 'react';
import useInitBalances from '@/custom-hooks/useInitBalances';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import { useSearchParams } from 'next/navigation';
import MultiSendPage from './multi-send/MultiSendPage';
import IBCSwapPage from './ibc-swaps/IBCSwapPage';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import EmptyScreen from '@/components/common/EmptyScreen';
import SingleTransfer from './single-send/SingleTransfer';

const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [sortedAssets, authzSortedAssets] = useSortedAssets(chainIDs, {
    showAvailable: true,
    AuthzSkipIBC: true,
  });
  const paramsTransferType = useSearchParams().get('type');

  const [transferType, setTransferType] = useState('single');

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  useInitBalances({ chainIDs });

  const dispatch = useAppDispatch();

  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  useEffect(() => {
    if (paramsTransferType?.length) {
      setTransferType(paramsTransferType.toLowerCase());
    } else {
      setTransferType('single');
    }
  }, [paramsTransferType]);

  return (
    <div className="h-full">
      {isWalletConnected ? (
        <div className="h-full">
          {transferType === 'single' ? (
            <SingleTransfer
              sortedAssets={isAuthzMode ? authzSortedAssets : sortedAssets}
            />
          ) : null}
          {transferType === 'multi-send' ? (
            <MultiSendPage chainID={chainIDs[0]} />
          ) : null}
          {transferType === 'ibc-swap' ? <IBCSwapPage /> : null}
        </div>
      ) : (
        <div className="py-20 px-10 h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center mt-16">
            <EmptyScreen
              title="Connect your wallet"
              description="Connect your wallet to access your account on Resolute"
              hasActionBtn={true}
              btnText={'Connect Wallet'}
              btnOnClick={connectWalletOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransfersPage;
