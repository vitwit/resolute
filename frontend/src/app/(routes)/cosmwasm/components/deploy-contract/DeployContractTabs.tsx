import React, { useState } from 'react';
import UseExistingCode from './UseExistingCode';
import UploadWasmFile from './UploadWasmFile';

const DeployContractTabs = () => {
  const tabs = ['Use Existing code ID', 'Upload  WASM file'];
  const [selectedTab, setSelectedTab] = useState('Use Existing code ID');
  return (
    <div className="space-y-10">
      <div className="tabs flex gap-6">
        {tabs.map((tab) => (
          <div key={tab} className="w-full justify-between gap-10 text-b1">
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
      <div className="">
        {selectedTab === 'Use Existing code ID' ? (
          <UseExistingCode />
        ) : (
          <UploadWasmFile />
        )}
      </div>
    </div>
  );
};

export default DeployContractTabs;
