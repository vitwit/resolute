import React, { useState } from 'react';
import MainTopNav from '@/components/MainTopNav';
import TransfersHistory from './TransfersHistory';
import SingleTransfer from './SingleTransfer';
import MultiTransfer from './MultiTransfer';
import useInitBalances from '@/custom-hooks/useInitBalances';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import AuthzToast from '@/components/AuthzToast';
import AuthzExecLoader from '@/components/AuthzExecLoader';
import FeegrantToast from '@/components/FeegrantToast';
import IBCSwap from './IBCSwap';

export interface TransfersTab {
  current: string;
  to: string;
}
const TransfersPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const [sortedAssets, authzSortedAssets] = useSortedAssets(chainIDs, {
    showAvailable: true,
    AuthzSkipIBC: true,
  });

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const isFeegrantMode = useAppSelector(
    (state) => state.feegrant.feegrantModeEnabled
  );

  useInitBalances({ chainIDs });

  const tabs = ['Send', 'Multi Send', 'Swap'];
  const [selectedTab, setSelectedTab] = useState('Send');

  const handleTabchange = (tab: string) => {
    if (tab.toLowerCase() === 'multi send' && chainIDs.length > 1) {
      dispatch(
        setError({
          type: 'error',
          message: 'Multi transfer is not available for All networks!',
        })
      );
    } else if (isAuthzMode) {
      dispatch(
        setError({
          type: 'error',
          message: 'Swap is not suppported in Authz Mode',
        })
      );
    } else if (isFeegrantMode) {
      dispatch(
        setError({
          type: 'error',
          message: 'Swap is not suppported in Feegrant Mode',
        })
      );
    } else {
      setSelectedTab(tab);
    }
  };

  return (
    <div className="w-full flex justify-between max-h-screen text-white flex-1">
      <AuthzExecLoader chainIDs={chainIDs} />
      <div className="w-full page-padding overflow-y-scroll flex flex-col flex-1">
        <MainTopNav title="Transfers" />
        <AuthzToast chainIDs={chainIDs} margins="mt-10 mb-4" />
        <FeegrantToast chainIDs={chainIDs} margins="mt-10 mb-4" />
        <div className="flex gap-10 items-center border-b-[1px] border-[#ffffff1e] mt-6">
          {tabs.map((tab) => (
            <div key={tab} className="flex flex-col justify-center">
              <div
                className={
                  selectedTab.toLowerCase() === tab.toLowerCase()
                    ? 'send-menu-item font-semibold'
                    : 'send-menu-item font-normal'
                }
                onClick={() => handleTabchange(tab)}
              >
                {tab}
              </div>
              <div
                className={
                  selectedTab.toLowerCase() === tab.toLowerCase()
                    ? 'rounded-full h-[3px] primary-gradient'
                    : 'rounded-full h-[3px] bg-transparent'
                }
              ></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col rounded-2xl space-y-6 mt-6 flex-1">
          {selectedTab === 'Send' ? (
            <div className="bg-[#0e0b26] rounded-2xl flex-1">
              <SingleTransfer
                sortedAssets={isAuthzMode ? authzSortedAssets : sortedAssets}
                chainIDs={chainIDs}
              />
            </div>
          ) : selectedTab === 'Multi Send' ? (
            <div className="bg-[#0e0b26] rounded-2xl flex flex-col flex-1">
              <MultiTransfer chainID={chainIDs[0]} />
            </div>
          ) : (
            <IBCSwap />
          )}
        </div>
      </div>
      <TransfersHistory chainIDs={chainIDs} />
    </div>
  );
};

export default TransfersPage;
