import ChainNotFound from '@/components/ChainNotFound';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react'
import TransactionHistoryDashboard from './TransactionHistoryDashboard';
import { useParams } from 'next/navigation';

const History = ({ chainNames }: { chainNames: string[] }) => {
    const nameToChainIDs = useAppSelector(
        (state: RootState) => state.common.nameToChainIDs
    );

    const chainIDs: string[] = [];

    chainNames.forEach((chainName) => {
        if (nameToChainIDs[chainName]) chainIDs.push(nameToChainIDs[chainName]);
    });

    const params = useParams();
    const paramChains = params.network;

    const arrChainNames =
    typeof paramChains === 'string' ? [paramChains] : paramChains;

    if (chainNames && chainNames.indexOf(arrChainNames[0]) <-1) {
        return <ChainNotFound />
    }

    const chainID = nameToChainIDs[arrChainNames[0]]

    return chainIDs.length ? (
            <div>
                <div className="text-h1">History</div>
                <TransactionHistoryDashboard  chainID={chainID}/>
            </div>
    ) : (
        <ChainNotFound />
    );
}

export default History