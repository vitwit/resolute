import { useAppSelector } from '@/custom-hooks/StateHooks';
import React, { useState } from 'react';
import QueryContract from './QueryContract';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import ExecuteContract from './ExecuteContract';

const ContractInfo = ({ chainID }: { chainID: string }) => {
  const selectedContractAddress = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.contractAddress
  );
  const selectedContractInfo = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.contractInfo
  );
  const tabs = ['Query Contract', 'Execute Contract'];
  const [selectedTab, setSelectedTab] = useState('Query Contract');
  const { getChainInfo } = useGetChainInfo();
  const {
    restURLs,
    rpcURLs,
    address: walletAddress,
    chainName,
  } = getChainInfo(chainID);
  return (
    <div className="space-y-20">
      <div className="space-y-6">
        <div className="pb-4 border-b-[1px] border-[#ffffff1e] font-bold text-[18px]">
          {selectedContractInfo.label || selectedContractAddress}
        </div>
        <div className="flex gap-10 bg-[#FFFFFF0D] p-10 rounded-2xl">
          <ContractInfoAttribute name="Network" value={chainID} />
          <ContractInfoAttribute
            name="From Code"
            value={selectedContractInfo.code_id}
          />
          <ContractInfoAttribute
            name="Admin Address"
            value={selectedContractInfo.admin}
          />
          <ContractInfoAttribute
            name="Instantiated Block Height"
            value={selectedContractInfo.created.block_height}
          />
          <ContractInfoAttribute
            name="Instantiated By"
            value={selectedContractInfo.creator}
          />
        </div>
      </div>
      <div className="space-y-10">
        <div className="flex gap-10 items-center justify-center border-b-[1px] border-[#ffffff1e] mt-6">
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
        <div className="flex justify-end">
          <div className="styled-btn-wrapper">
            <button className="styled-btn w-[144px]">
              {true ? 'Default Format' : 'JSON Format'}
            </button>
          </div>
        </div>
        <div>
          {selectedTab === 'Query Contract' ? (
            <QueryContract
              address={selectedContractAddress}
              baseURLs={restURLs}
              chainID={chainID}
            />
          ) : (
            <ExecuteContract
              address={selectedContractAddress}
              baseURLs={restURLs}
              chainID={chainID}
              rpcURLs={rpcURLs}
              walletAddress={walletAddress}
              chainName={chainName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;

const ContractInfoAttribute = ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => {
  return (
    <div className="space-y-2 text-[14px]">
      <div>{name}</div>
      <div className="bg-[#FFFFFF0D] rounded-lg px-4 py-2">{value}</div>
    </div>
  );
};
