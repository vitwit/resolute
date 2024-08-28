import PageHeader from '@/components/common/PageHeader';
import { DEPLOY_CONTRACT_DESCRIPTION } from '@/utils/constants';
import React, { useState } from 'react';
import DeployContractTabs from './DeployContractTabs';
import UploadWasmFile from './UploadWasmFile';
import InstantiateContract from './InstantiateContract';

const DeployContract = ({ chainID }: { chainID: string }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (tab: number) => {
    setSelectedTab(tab);
  };
  return (
    <div className="py-10 h-full space-y-10 min-h-[100vh]">
      <PageHeader title="Deploy" description={DEPLOY_CONTRACT_DESCRIPTION} />
      <div className="space-y-10">
        <DeployContractTabs
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
        />
        <div>
          {selectedTab === 0 ? (
            <InstantiateContract chainID={chainID} />
          ) : (
            <UploadWasmFile chainID={chainID} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployContract;
