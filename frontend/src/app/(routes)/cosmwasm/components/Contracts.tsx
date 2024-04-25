import React, { useState } from 'react';
import SearchContracts from './SearchContracts';
import DeployContract from './DeployContract';
import ContractInfo from './ContractInfo';

const Contracts = ({ chainID }: { chainID: string }) => {
  const [deployContractOpen, setDeployContractOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState({
    address: '',
    name: '',
  });
  const handleSelectContract = (address: string, name: string) => {
    setDeployContractOpen(false);
    setSelectedContract({ address, name });
  };

  return (
    <div className="h-full flex flex-col gap-10">
      <div className="border-b-[1px] border-[#ffffff1e] pb-4 space-y-2">
        <div className="text-[18px] font-bold">CosmWasm Smart Contracts</div>
        <div className="leading-[18px] text-[12px] font-extralight">
          CosmWasm is a smart contracting platform built for the Cosmos
          ecosystem.
        </div>
      </div>
      <div>
        <div className="space-y-6">
          <SearchContracts
            chainID={chainID}
            selectedContract={selectedContract}
            handleSelectContract={handleSelectContract}
          />
          <div
            className={`text-[18px] ${deployContractOpen ? 'invisible' : 'visible'}`}
          >
            Don&apos;t have a contract? then deploy it{' '}
            <span
              onClick={() => {
                setDeployContractOpen(true);
                setSelectedContract({
                  address: '',
                  name: '',
                });
              }}
              className="font-bold underline underline-offset-[3px] cursor-pointer"
            >
              here
            </span>{' '}
          </div>
        </div>
      </div>
      {deployContractOpen && !selectedContract.address ? (
        <DeployContract chainID={chainID} />
      ) : null}
      {selectedContract.address ? <ContractInfo chainID={chainID} /> : null}
    </div>
  );
};

export default Contracts;
