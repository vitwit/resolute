import { useAppSelector } from '@/custom-hooks/StateHooks';
import React, { useState } from 'react';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import QueryContract from './QueryContract';
import ExecuteContract from './ExecuteContract';

const ContractInfo = ({ chainID }: { chainID: string }) => {
  const selectedContractAddress = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.contractAddress
  );
  const selectedContractInfo = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.contractInfo
  );
  const tabs = ['Execute Contract', 'Query Contract'];
  const [selectedTab, setSelectedTab] = useState('Execute Contract');
  const [infoOpen, setInfoOpen] = useState(false);

  const { getChainInfo } = useGetChainInfo();
  const {
    restURLs,
    rpcURLs,
    address: walletAddress,
    chainName,
  } = getChainInfo(chainID);

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="pb-4 border-b-[1px] border-[#ffffff1e] font-bold text-[18px]">
          {selectedContractInfo?.label || selectedContractAddress}
        </div>
        <div className="bg-[#ffffff0D] rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-[14px]">Contract Info</div>
            <Image
              onClick={() => setInfoOpen((prev) => !prev)}
              className="cursor-pointer"
              src={infoOpen ? '/expand-close.svg' : '/expand-open.svg'}
              height={24}
              width={24}
              alt="Expand"
            />
          </div>
          {infoOpen ? (
            <div className="gap-10 grid grid-cols-4 justify-between">
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
          ) : null}
        </div>
      </div>
      <div className="space-y-10 pb-10">
        <div className="tabs flex gap-6">
          {tabs.map((tab) => (
            <div key={tab} className="w-full justify-between gap-10">
              <div
                className={`selected-filters
                  ${selectedTab.toLowerCase() === tab.toLowerCase()
                    ? // ? 'menu-item font-semibold'
                      // : 'menu-item font-normal'
                      'bg-[#ffffff14] border-transparent'
                    : 'border-[#ffffff26]'}
                `}
                onClick={() => {
                  setSelectedTab(tab);
                }}
              >
                {tab}
              </div>
              <div
                className={
                  selectedTab.toLowerCase() === tab.toLowerCase()
                    ? // ? 'rounded-full h-[3px] primary-gradient'
                      // : 'rounded-full h-[3px] bg-transparent'
                      'bg-[#ffffff14] border-transparent'
                    : 'border-[#ffffff26]'
                }
              ></div>
            </div>
          ))}
        </div>
        <div className="">
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
    <>
      {value ? (
        <div className="space-y-2 bg-[#FFFFFF0D] rounded-lg p-4 justify-center items-center text-center">
          <div className="text-b1-light">{name}</div>
          <div className="text-h2 !font-bold truncate">{value}</div>
        </div>
      ) : null}
    </>
  );
};
