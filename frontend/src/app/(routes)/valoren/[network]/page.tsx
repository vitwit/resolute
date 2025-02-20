'use client';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import React from 'react';
import UserActionsList from '../components/UserActionsList';
import '../styles.css';
import EmptyScreen from '@/components/common/EmptyScreen';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import PageHeader from '@/components/common/PageHeader';

const ChainProposals = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const paramChain = params.network;
  const chainName = typeof paramChain === 'string' ? paramChain : '';
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  let chainID: string = '';
  Object.keys(nameToChainIDs).forEach((chain) => {
    if (chain === chainName) chainID = nameToChainIDs[chain];
  });
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };
  return (
    <>
      {chainID.length ? (
        <>
          {!isWalletConnected ? (
            <div className="py-10">
              <PageHeader
                title="Valoren"
                description="Cosmos stake management : Auto Restake and Auto Redelegate"
              />
              <div className="mt-16">
                <EmptyScreen
                  title="Connect your wallet"
                  description="Connect your wallet to access your account on Resolute"
                  hasActionBtn={true}
                  btnText={'Connect Wallet'}
                  btnOnClick={connectWalletOpen}
                />
              </div>
            </div>
          ) : (
            <div className="py-10 h-full">
              <UserActionsList chainID={chainID} />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          - Chain Not found -
        </div>
      )}
    </>
  );
};

export default ChainProposals;
