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
import useSortedAssets from '@/custom-hooks/useSortedAssets';

export interface TransfersTab {
  current: string;
  to: string;
}
const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const [sortedAssets] = useSortedAssets(chainIDs, { showAvailable: true });
  const [tab, setTab] = useState<TransfersTab>(TRANSFERS_TAB1);
  const changeTab = (tab: TransfersTab) => {
    if (tab === TRANSFERS_TAB1) setTab(TRANSFERS_TAB2);
    else setTab(TRANSFERS_TAB1);
  };

  useInitBalances({ chainIDs });

  const handleTabChange = () => {
    if (chainIDs.length > 1) {
      dispatch(
        setError({
          type: 'error',
          message: 'Multi transfer is not available for All networks!',
        })
      );

      return;
    }
    changeTab(tab);
  };

  return (
    <div className="w-full flex justify-between max-h-screen text-white flex-1">
      <div className="w-full page-padding overflow-y-scroll flex flex-col flex-1">
        <MainTopNav title="Transfers" />

        <div className="flex flex-col rounded-2xl bg-[#0e0b26] space-y-6 mt-6 flex-1">
          {tab.current === SINGLE_TAB_TEXT ? (
            <SingleTransfer
              sortedAssets={sortedAssets}
              chainIDs={chainIDs}
              tab={tab}
              handleTabChange={handleTabChange}
            />
          ) : (
            <MultiTransfer
              chainID={chainIDs[0]}
              tab={tab}
              handleTabChange={handleTabChange}
            />
          )}
        </div>
      </div>
      <TransfersHistory chainIDs={chainIDs} />
    </div>
  );
};

export default TransfersPage;
