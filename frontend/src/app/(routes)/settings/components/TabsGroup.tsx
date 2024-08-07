import { useAppSelector } from '@/custom-hooks/StateHooks';
import Link from 'next/link';
import React from 'react';

const TABS = ['general', 'authz', 'feegrant'];

const TabsGroup = ({
  selectedTab,
  action,
  actionName,
}: {
  selectedTab: string;
  action: () => void;
  actionName: string;
}) => {
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const getPathUrl = (tab: string) => {
    if (tab === 'general') {
      return '/settings';
    } else if (selectedNetwork) {
      return `/settings/${tab}/${selectedNetwork.toLowerCase()}`;
    } else {
      return `/settings/${tab}`;
    }
  };
  return (
    <div className="flex justify-between items-end gap-6">
      <div className="flex gap-10 items-center flex-1 border-b-[1px] border-[#ffffff1d]">
        {TABS.map((tab) => (
          <div key={tab} className="flex flex-col justify-center">
            <Link
              className={`text-[18px] mb-2 px-1 capitalize ${
                tab === selectedTab ? 'text-[#fffffff0]' : 'text-[#ffffff80]'
              }`}
              href={getPathUrl(tab.toLowerCase())}
            >
              {tab}
            </Link>
            <div
              className={`h-1 w-full rounded-full ${tab === selectedTab ? 'selected-tab' : ''}`}
            ></div>
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={action}>
        {actionName}
      </button>
    </div>
  );
};

export default TabsGroup;
