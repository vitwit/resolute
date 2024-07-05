import React, { useEffect } from 'react';
import MultiSend from './MultiSend';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import EmptyScreen from '@/components/common/EmptyScreen';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { MULTISIG_DESCRIPTION } from '@/utils/constants';

const MultiSendPage = ({ chainID }: { chainID: string }) => {
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  useEffect(() => {
    if (isWalletConnected && !selectedNetwork) {
      openChangeNetwork();
    }
  }, []);
  return (
    <>
      {selectedNetwork && isWalletConnected ? (
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center h-full">
          <div className="space-y-4 w-[600px] md:w-[400px]">
            <div className="text-[20px] font-bold">Multi Transfer</div>
            <div className="divider-line" />
            <div className="secondary-text">{MULTISIG_DESCRIPTION}</div>
          </div>
          <div className="max-w-[600px]">
            <MultiSend chainID={chainID} />
          </div>
        </div>
      ) : (
        <div className="py-20 px-10 h-full flex flex-col">
          <div>
            <div className="flex-1 flex items-center justify-center mt-16">
              {isWalletConnected ? (
                <EmptyScreen
                  title="Please select a network"
                  description="All networks page is not supported for multi send, Please select a network."
                  hasActionBtn={true}
                  btnText={'Select Network'}
                  btnOnClick={openChangeNetwork}
                />
              ) : (
                <EmptyScreen
                  title="Connect your wallet"
                  description="Connect your wallet to access your account on Resolute"
                  hasActionBtn={true}
                  btnText={'Connect Wallet'}
                  btnOnClick={connectWalletOpen}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MultiSendPage;
