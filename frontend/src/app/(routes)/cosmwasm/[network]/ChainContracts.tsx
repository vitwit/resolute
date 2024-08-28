'use client';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import PageContracts from './PageContracts';
import { useSearchParams } from 'next/navigation';
import AllContracts from '../components/all-contracts/AllContracts';
import DeployContract from '../components/deploy-contract/DeployContract';
import DialogTxExecuteStatus from '../components/tx-status/DialogTxExecuteStatus';
import DialogTxInstantiateStatus from '../components/tx-status/DialogTxInstantiateStatus';
import DialogTxUploadCodeStatus from '../components/tx-status/DialogTxUploadCodeStatus';

interface ChainContractsProps {
  network: string;
}

const ChainContracts: React.FC<ChainContractsProps> = ({ network }) => {
  const nameToChainIDs = useAppSelector((state) => state.common.nameToChainIDs);
  const chainName = network.toLowerCase();
  const chainID = nameToChainIDs?.[chainName];
  const paramTabName = useSearchParams().get('tab');

  if (!chainID) {
    return (
      <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
        - The {chainName} is not supported -
      </div>
    );
  }

  const renderContent = () => {
    switch (paramTabName) {
      case 'codes':
        return <AllContracts chainID={chainID} />;
      case 'deploy':
        return <DeployContract chainID={chainID} />;
      default:
        return <PageContracts chainName={chainName} />;
    }
  };

  return (
    <div>
      {renderContent()}
      <DialogTxExecuteStatus chainID={chainID} />
      <DialogTxInstantiateStatus chainID={chainID} />
      <DialogTxUploadCodeStatus chainID={chainID} />
    </div>
  );
};

export default ChainContracts;
