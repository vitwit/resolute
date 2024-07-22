import React, { useEffect } from 'react';
import MultiSend from './MultiSend';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import EmptyScreen from '@/components/common/EmptyScreen';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';

const MultiSendPage = ({ chainID }: { chainID: string }) => {
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };

  useEffect(() => {
    if (isWalletConnected && !selectedNetwork) {
      openChangeNetwork();
    }
  }, []);
  return (
    <>
      {selectedNetwork && isWalletConnected ? (
        <MultiSend chainID={chainID} />
      ) : (
        <EmptyScreen
          title="Please select a network"
          description="All networks page is not supported for multi send, Please select a network."
          hasActionBtn={true}
          btnText={'Select Network'}
          btnOnClick={openChangeNetwork}
        />
      )}
    </>
  );
};

export default MultiSendPage;
