import React, { useState } from 'react';
import SelectDeploymenyType from './SelectDeploymentType';
import UploadContract from './UploadContract';
import InstantiateContract from './InstantiateContract';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const DeployContract = ({ chainID }: { chainID: string }) => {
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const onSelect = (value: boolean) => {
    setIsFileUpload(value);
  };
  return (
    <div className="space-y-10 h-full flex flex-col">
      <div className="space-y-10">
        <div className="pb-4 border-b-[1px] border-[#ffffff60] text-[18px] font-bold">
          Deploy Contract
        </div>
        <SelectDeploymenyType isFileUpload={isFileUpload} onSelect={onSelect} />
      </div>
      {isFileUpload ? (
        <UploadContract chainID={chainID} walletAddress={walletAddress} />
      ) : (
        <InstantiateContract chainID={chainID} walletAddress={walletAddress} />
      )}
    </div>
  );
};

export default DeployContract;
