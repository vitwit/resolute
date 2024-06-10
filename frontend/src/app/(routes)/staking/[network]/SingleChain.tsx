import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react'
import SingleStakingDashboard from './SingleChainDashboard';

function SingleChain({
    paramChain,
    // queryParams,
}: {
    paramChain: string;
    // queryParams?: { [key: string]: string | undefined };
}) {
    const nameToChainIDs = useAppSelector(
        (state: RootState) => state.wallet.nameToChainIDs
    );

    const validChain = Object.keys(nameToChainIDs).some(
        (chain) => paramChain.toLowerCase() === chain.toLowerCase()
    );

    const chainID = nameToChainIDs[paramChain];

    // const validatorAddress = queryParams?.validator_address || '';
    // const action = queryParams?.action || '';

    return (
        <div>
            {validChain ? (
                <SingleStakingDashboard
                chainID={chainID}
                />
            ) : (
                <>
                    <div className="flex justify-center items-center h-screen w-full text-white txt-lg">
                        - Chain not found -
                    </div>
                </>
            )}
        </div>
    );

}

export default SingleChain