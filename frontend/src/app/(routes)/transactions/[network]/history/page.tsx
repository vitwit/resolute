'use client';

import EmptyScreen from '@/components/common/EmptyScreen';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { RootState } from '@/store/store';
import React from 'react';
import History from './components/History';


const Page = () => {
    const dispatch = useAppDispatch();
    const isWalletConnected = useAppSelector((state: RootState) => state.wallet.connected);

    const connectWallet = () => {
        dispatch(setConnectWalletOpen(true));
    };

    const nameToChainsIDs = useAppSelector(
        (state) => state.common.nameToChainIDs
    );
    const chainNames = Object.keys(nameToChainsIDs);

    return (
        <div className="mt-10 space-y-10">
            {isWalletConnected ? (
                <History chainNames={chainNames} />
            ) : (
                <div className="pt-10">
                    <EmptyScreen
                        title="Connect your wallet"
                        description="Connect your wallet to access your account on Resolute"
                        hasActionBtn={true}
                        btnText={'Connect Wallet'}
                        btnOnClick={connectWallet}
                    />
                </div>
            )}
        </div>
    )

}

export default Page;