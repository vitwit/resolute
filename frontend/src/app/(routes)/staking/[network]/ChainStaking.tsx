'use client';
import React from 'react';
import StakingPage from '../components/StakingPage';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

const ChainStaking = ({
  paramChain,
  queryParams,
}: {
  paramChain: string;
  queryParams?: { [key: string]: string | undefined };
}) => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  let validChain = false;
  Object.keys(nameToChainIDs).forEach((chain) => {
    if (paramChain.toLowerCase() === chain.toLowerCase()) {
      validChain = true;
    }
  });
  const validatorAddress = queryParams?.validator_address || '';
  const action = queryParams?.action || '';

  return (
    <div>
      {validChain ? (
        <StakingPage chainName={paramChain} validatorAddress={validatorAddress} action={action} />
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

export default ChainStaking;
