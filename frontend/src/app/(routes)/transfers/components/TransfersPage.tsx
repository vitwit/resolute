import React, { useEffect } from 'react';
import '../transfer.css';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getBalances } from '@/store/features/bank/bankSlice';
import MainTopNav from '@/components/MainTopNav';
import TransfersHistory from './TransfersHistory';

const TransfersPage = ({ chainID }: { chainID: string }) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);

  useEffect(() => {
    const allChainInfo = networks[chainID];
    const chainInfo = allChainInfo.network;
    const address = allChainInfo?.walletInfo?.bech32Address;
    const basicChainInputs = {
      baseURL: chainInfo.config.rest,
      address,
      chainID,
    };
    dispatch(getBalances(basicChainInputs));
  }, [chainID]);
  return (
    <div className="w-full flex justify-between h-screen">
      <div
        className="w-full px-10 py-6 space-y-6 overflow-hidden"
        style={{ height: 'calc(100% - 24px)' }}
      >
        <MainTopNav title="Transfers" />
        <div className="h-full rounded-2xl bg-[#0e0b26]"></div>
      </div>
      <TransfersHistory chainIDs={[chainID]} />
    </div>
  );
};

export default TransfersPage;
