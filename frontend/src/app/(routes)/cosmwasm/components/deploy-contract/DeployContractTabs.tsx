import React, { useState } from 'react';

const DeployContractTabs = () => {
  const tabs = ['Use Existing code ID', 'Upload  WASM file'];
  const [selectedTab, setSelectedTab] = useState('Use Existing code ID');
  return (
    <div className="space-y-10">
      <div className="tabs flex gap-6">
        {tabs.map((tab) => (
          <div key={tab} className="w-full justify-between gap-10">
            <div
              className={`selected-filters
                  ${
                    selectedTab.toLowerCase() === tab.toLowerCase()
                      ? 'bg-[#ffffff14] border-transparent'
                      : 'border-[#ffffff26]'
                  }
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
                  ? 'bg-[#ffffff14] border-transparent'
                  : 'border-[#ffffff26]'
              }
            ></div>
          </div>
        ))}
      </div>
      {/* <div className="">
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
      </div> */}
    </div>
  );
};

export default DeployContractTabs;
