import React from 'react';

const DeployContractTabs = ({
  selectedTab,
  handleTabChange,
}: {
  selectedTab: number;
  handleTabChange: (tab: number) => void;
}) => {
  const tabs = ['Use Existing code ID', 'Upload  WASM file'];
  return (
    <div className="tabs flex gap-6">
      {tabs.map((tab, index) => (
        <div key={tab} className="w-full justify-between gap-10 text-b1">
          <div
            className={`selected-filters cursor-pointer 
                  ${
                    selectedTab === index
                      ? 'bg-[#ffffff14] border-transparent'
                      : 'border-[#ffffff26]'
                  }
                `}
            onClick={() => handleTabChange(index)}
          >
            {tab}
          </div>
          <div
            className={
              selectedTab === index
                ? 'bg-[#ffffff14] border-transparent'
                : 'border-[#ffffff26]'
            }
          ></div>
        </div>
      ))}
    </div>
  );
};

export default DeployContractTabs;
