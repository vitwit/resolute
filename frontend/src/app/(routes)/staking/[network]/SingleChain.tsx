import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import SingleStakingDashboard from './SingleChainDashboard';

function SingleChain({
  paramChain,
  // queryParams,
}: {
  paramChain: string;
  // queryParams?: { [key: string]: string | undefined };
}) {
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const allNameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );
  const connectedNameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const nameToChainIDs = isWalletConnected
    ? connectedNameToChainIDs
    : allNameToChainIDs;

  const validChain = Object.keys(nameToChainIDs).some(
    (chain) => paramChain.toLowerCase() === chain.toLowerCase()
  );

  const chainID = nameToChainIDs[paramChain];

  // const validatorAddress = queryParams?.validator_address || '';
  // const action = queryParams?.action || '';

  return (
    <div>
      {validChain ? (
        <SingleStakingDashboard chainID={chainID} />
      ) : (
        <>
          <div className="flex justify-center items-center h-screen w-full txt-lg">
            - Chain not found -
          </div>
        </>
      )}
    </div>
  );
}

export default SingleChain;
