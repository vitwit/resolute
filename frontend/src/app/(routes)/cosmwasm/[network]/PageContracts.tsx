'use client';
import React from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import Contract from '../components/single-contract/Contract';
import PageHeader from '@/components/common/PageHeader';
import { COSMWASM_DESCRIPTION } from '@/utils/constants';
import DialogTxExecuteStatus from '../components/tx-status/DialogTxExecuteStatus';
import DialogTxInstantiateStatus from '../components/tx-status/DialogTxInstantiateStatus';
import DialogTxUploadCodeStatus from '../components/tx-status/DialogTxUploadCodeStatus';

const PageContracts = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state) => state.common.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  return (
    <div className="py-10 h-full space-y-10 min-h-[100vh]">
      <PageHeader title="Cosmwasm" description={COSMWASM_DESCRIPTION} />
      <Contract chainID={chainID} />
      <DialogTxExecuteStatus chainID={chainID} />
      <DialogTxInstantiateStatus chainID={chainID} />
      <DialogTxUploadCodeStatus chainID={chainID} />
    </div>
  );
};

export default PageContracts;
