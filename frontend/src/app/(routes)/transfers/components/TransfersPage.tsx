import React, { useState } from 'react';
import MainTopNav from '@/components/MainTopNav';
import TransfersHistory from './TransfersHistory';
import { TRANSFERS_TAB2 } from '../../../../utils/constants';
import { SINGLE_TAB_TEXT, TRANSFERS_TAB1 } from '@/utils/constants';
import SingleTransfer from './SingleTransfer';
import MultiTransfer from './MultiTransfer';
import useInitBalances from '@/custom-hooks/useInitBalances';

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

  useInitBalances({ chainIDs });

  return (
    <div className="w-full flex justify-between max-h-screen text-white">
      <div className="w-full page-padding space-y-6 overflow-y-scroll">
        <MainTopNav title="Transfers" />
        <div className="flex flex-col rounded-2xl bg-[#0e0b26] p-6 space-y-6">
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
