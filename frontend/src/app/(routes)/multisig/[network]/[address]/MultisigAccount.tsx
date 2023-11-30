'use client';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import PageMultisigInfo from '../../components/PageMultisigInfo';

const MultisigAccount = ({
  paramChain,
  paramAddress,
}: {
  paramChain: string;
  paramAddress: string;
}) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  let validChain = false;
  const chainName = paramChain.toLowerCase();
  Object.keys(nameToChainIDs).forEach((chain) => {
    if (paramChain.toLowerCase() === chain.toLowerCase()) {
      validChain = true;
    }
  });
  return (
    <div>
      {validChain ? (
        <PageMultisigInfo chainName={chainName} address={paramAddress} />
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
            - Chain not found -
          </div>
        </>
      )}
    </div>
  );
};

export default MultisigAccount;
