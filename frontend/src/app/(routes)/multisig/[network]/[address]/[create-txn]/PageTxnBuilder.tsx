'use client';

import EmptyScreen from '@/components/common/EmptyScreen';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import { setVerifyDialogOpen } from '@/store/features/multisig/multisigSlice';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import React, { useEffect } from 'react';
import DialogVerifyAccount from '../../../components/DialogVerifyAccount';
import PageHeader from '@/components/common/PageHeader';
import TxnBuilder from '@/components/txn-builder/TxnBuilder';

const PageTxnBuilder = ({
  paramChain,
  multisigAddress,
}: {
  paramChain: string;
  multisigAddress: string;
}) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainName = paramChain.toLowerCase();
  const validChain = chainName in nameToChainIDs;
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="py-20 px-10 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 sticky top-0">
        <PageHeader
          title="Transaction Builder"
          description="Transaction builder allows to create single transaction with multiple
          messages of same or different type."
        />
      </div>
      {validChain ? (
        <>
          {isWalletConnected ? (
            <PageTxnBuilderEntry chainName={chainName} />
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

export default PageTxnBuilder;

const PageTxnBuilderEntry = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs?.[chainName];
  const { getChainInfo } = useGetChainInfo();
  const { address } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({ address });

  const handleVerifyAccount = () => {
    dispatch(setVerifyDialogOpen(true));
  };

  useEffect(() => {
    if (!isAccountVerified()) {
      handleVerifyAccount();
    }
  }, []);

  return (
    <>
      {isAccountVerified() ? (
        <TxnBuilder chainID={chainID} />
      ) : (
        <EmptyScreen
          title="Verify Ownership"
          description="Verify your account ownership to proceed"
          btnOnClick={handleVerifyAccount}
          btnText="Verify Ownership"
          hasActionBtn={true}
        />
      )}
      <DialogVerifyAccount walletAddress={address} />
    </>
  );
};
