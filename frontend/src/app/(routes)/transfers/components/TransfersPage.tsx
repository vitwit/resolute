import React, { useState } from 'react';
import MainTopNav from '@/components/MainTopNav';
import TransfersHistory from './TransfersHistory';
import { TRANSFERS_TAB2 } from '../../../../utils/constants';
import { SINGLE_TAB_TEXT, TRANSFERS_TAB1 } from '@/utils/constants';
import SingleTransfer from './SingleTransfer';
import MultiTransfer from './MultiTransfer';
import useInitBalances from '@/custom-hooks/useInitBalances';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';

export interface TransfersTab {
  current: string;
  to: string;
}
const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<TransfersTab>(TRANSFERS_TAB1);
  const changeTab = (tab: TransfersTab) => {
    if (tab === TRANSFERS_TAB1) setTab(TRANSFERS_TAB2);
    else setTab(TRANSFERS_TAB1);
  };

  useInitBalances({ chainIDs });

  return (
    <div className="w-full flex justify-between max-h-screen text-white">
      <div className="w-full page-padding overflow-y-scroll">
        <MainTopNav title="Transfers" />
        <div className="flex justify-between items-center mt-10">
          <div className="text-base not-italic font-normal leading-[normal]">
            {tab.current}
          </div>

          <button
            className="secondary-custom-btn"
            onClick={() => {
              if (chainIDs.length > 1) {
                dispatch(
                  setError({
                    type: 'error',
                    message:
                      'Multi transfer is not available for All networks!',
                  })
                );

                return;
              }
              changeTab(tab);
            }}
          >
            {tab.to}
          </button>
        </div>
        <div className="flex flex-col rounded-2xl bg-[#0e0b26] space-y-6 mt-6">
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
