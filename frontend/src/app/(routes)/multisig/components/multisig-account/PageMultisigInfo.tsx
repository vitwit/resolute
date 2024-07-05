'use client';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import EmptyScreen from '@/components/common/EmptyScreen';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import MultisigAccount from './MultisigAccount';

const PageMultisigInfo = ({
  paramChain,
  paramAddress,
}: {
  paramChain: string;
  paramAddress: string;
}) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );
  const chainName = paramChain.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="py-10 h-full flex flex-col">
      {validChain ? (
        <>
          {isWalletConnected ? (
            <MultisigAccount
              chainName={chainName}
              multisigAddress={paramAddress}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyScreen
                title="Connect your wallet"
                description="Connect your wallet to access your account on Resolute"
                hasActionBtn={true}
                btnText={'Connect Wallet'}
                btnOnClick={connectWalletOpen}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
            - The {chainName} is not supported -
          </div>
        </>
      )}
    </div>
  );
};

export default PageMultisigInfo;
