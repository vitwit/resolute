'use client';
import TopNav from '@/components/TopNav';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import Contracts from '../components/Contracts';
import AllContracts from '../components/AllContracts';
import DialogTxContractStatus from '../components/DialogTxUploadCodeStatus';
import DialogTxExecuteStatus from '../components/DialogTxExecuteStatus';
import DialogTxInstantiateStatus from '../components/DialogTxInstantiateStatus';
import { useRouter, useSearchParams } from 'next/navigation';

const PageContracts = ({ chainName }: { chainName: string }) => {
  const router = useRouter();
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  const tabs = ['Contracts', 'All Contracts'];
  const [selectedTab, setSelectedTab] = useState('Contracts');

  const paramContractAddress = useSearchParams().get('contract');
  const paramsCodeId = useSearchParams().get('code_id');

  useEffect(() => {
    if (paramContractAddress?.length) {
      setSelectedTab('Contracts');
    }
  }, [paramContractAddress]);

  useEffect(() => {
    if (paramsCodeId?.length) {
      setSelectedTab('All Contracts');
    }
  }, [paramsCodeId]);

  return (
    <div className="h-screen flex flex-col p-6 px-10 gap-10">
      <div className="flex flex-col gap-6">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-[20px] leading-normal font-normal">
            CosmWasm Smart Contracts
          </h2>
          <TopNav />
        </div>
        <div className="flex gap-10 items-center border-b-[1px] border-[#ffffff1e] mt-6">
          {tabs.map((tab) => (
            <div key={tab} className="flex flex-col justify-center">
              <div
                className={
                  selectedTab.toLowerCase() === tab.toLowerCase()
                    ? 'menu-item font-semibold'
                    : 'menu-item font-normal'
                }
                onClick={() => {
                  setSelectedTab(tab);
                  router.push(`/cosmwasm/${chainName.toLowerCase()}`);
                }}
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
      </div>

      <div className="rounded-2xl bg-[#FFFFFF0D] p-10 h-full overflow-y-scroll">
        {selectedTab === 'Contracts' ? (
          <Contracts chainID={chainID} />
        ) : (
          <AllContracts chainID={chainID} />
        )}
      </div>
      <DialogTxContractStatus chainID={chainID} />
      <DialogTxExecuteStatus chainID={chainID} />
      <DialogTxInstantiateStatus chainID={chainID} />
    </div>
  );
};

export default PageContracts;
