import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getBalances } from '@/store/features/bank/bankSlice';
import MainTopNav from '@/components/MainTopNav';
import TransfersHistory from './TransfersHistory';
import { TRANSFERS_TAB2 } from '../../../../utils/constants';
import { SINGLE_TAB_TEXT, TRANSFERS_TAB1 } from '@/utils/constants';
import SingleTransfer from './SingleTransfer';
import MultiTransfer from './MultiTransfer';

export interface TransfersTab {
  current: string;
  to: string;
}
const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [tab, setTab] = useState<TransfersTab>(TRANSFERS_TAB1);
  const changeTab = (tab: TransfersTab) => {
    if (tab === TRANSFERS_TAB1) setTab(TRANSFERS_TAB2);
    else setTab(TRANSFERS_TAB1);
  };
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const basicChainInputs = {
        baseURL: chainInfo.config.rest,
        address,
        chainID,
      };
      dispatch(getBalances(basicChainInputs));
    });
  }, []);

  return (
    <div className="w-full flex justify-between h-screen text-white">
      <div
        className="w-full px-10 py-6 space-y-6 overflow-hidden"
        style={{ height: 'calc(100% - 24px)' }}
      >
        <MainTopNav title="Transfers" />
        <div className="h-full rounded-2xl bg-[#0e0b26] p-6 space-y-6">
          <div className="flex justify-between">
            <div className="text-base not-italic font-normal leading-[normal]">
              {tab.current}
            </div>

            <button
              className="primary-action-btn w-auto h-auto px-3 py-[10px] rounded-lg"
              onClick={() => {
                if (chainIDs.length > 1) {
                  alert('Multi transfer is not available for All networks!');
                  return;
                }
                changeTab(tab);
              }}
            >
              {tab.to}
            </button>
          </div>
          {tab.current === SINGLE_TAB_TEXT ? (
            <SingleTransfer chainIDs={chainIDs} />
          ) : (
            <MultiTransfer chainID={chainIDs[0]} />
          )}
        </div>
      </div>
      <TransfersHistory chainIDs={chainIDs} />
    </div>
  );
};

export default TransfersPage;
