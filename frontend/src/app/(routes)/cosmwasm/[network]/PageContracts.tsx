'use client';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { useRouter, useSearchParams } from 'next/navigation';
import Contract from '../components/single-contract/Contract';
import PageHeader from '@/components/common/PageHeader';
import { COSMWASM_DESCRIPTION } from '@/utils/constants';

const PageContracts = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state) => state.common.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  return (
    <div className="py-10 h-full space-y-10 min-h-[100vh]">
      <PageHeader title="Cosmwasm" description={COSMWASM_DESCRIPTION} />
      <Contract chainID={chainID} />
    </div>
  );
};

export default PageContracts;
