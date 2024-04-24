import React, { useState } from 'react';
import SelectDeploymentType from './SelectDeploymentType';
import UploadContract from './UploadContract';
import InstantiateContract from './InstantiateContract';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const DeployContract = ({ chainID }: { chainID: string }) => {
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress, restURLs } = getChainInfo(chainID);
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
        <SelectDeploymentType isFileUpload={isFileUpload} onSelect={onSelect} />
      </div>
      {isFileUpload ? (
        <UploadContract
          chainID={chainID}
          walletAddress={walletAddress}
          restURLs={restURLs}
        />
      ) : (
        <InstantiateContract
          chainID={chainID}
          walletAddress={walletAddress}
          restURLs={restURLs}
        />
      )}
    </div>
  );
};

export default DeployContract;
