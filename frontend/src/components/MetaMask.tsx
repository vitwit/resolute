import { Button } from '@mui/material'
import React from 'react'
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { establishWalletConnection } from '@/store/features/wallet/walletSlice';
import { networks } from '@/utils/chainsInfo';

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
// import { GasPrice } from '@cosmjs/stargate';
import { CosmjsOfflineSigner } from '@leapwallet/cosmos-snap-provider';


// declare let window: WalletWindow;

function MetaMask() {
    const dispatch = useAppDispatch();

    const handleClick = async () => {
        try {
            for (let i = 0; i < networks.length; i++) {
                console.log('network----', i)
                const chainId: string = networks[i].config.chainId;
                const chainName: string = networks[i].config.chainName;
                console.log('data=== chainId============', chainId, chainName)

                const offlineSigner = new CosmjsOfflineSigner(chainId);
                const accounts = await offlineSigner.getAccounts();
                console.log('accounts', accounts)
                const rpcUrl = networks[i].config.rpc; // Populate with an RPC URL corresponding to the given chainId

                const stargateClient = await SigningCosmWasmClient.connectWithSigner(
                    rpcUrl,
                    offlineSigner
                );

                console.log('stargate client', stargateClient)
            }

        } catch (error) {
            console.log(error);
        }



        dispatch(
            establishWalletConnection({
                walletName: 'metamask',
                networks: [...networks],
            })
        );
    }


    return (
        <div>
            <Button onClick={handleClick}>Connect Metamask</Button>
        </div>
    )
}

export default MetaMask