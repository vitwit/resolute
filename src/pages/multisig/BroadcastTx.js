import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { Button } from '@mui/material'
import React from 'react'

import { StargateClient, SigningStargateClient, makeMultisignedTx } from "@cosmjs/stargate";
import { useSelector } from 'react-redux';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

async function getKeplrWalletAmino(chainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts[0]];
}

export default function BroadcastTx() {
    const from = useSelector((state) => state.wallet.address);
    const signData =  JSON.parse(localStorage.getItem('sign')) || {};
    const txInfo = localStorage.getItem('un_signed_tx') && JSON.parse(localStorage.getItem('un_signed_tx')) || {};
    const multisig = localStorage.getItem('multisig') && JSON.parse(localStorage.getItem('multisig')) || {};
    
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    
    const broadcastTxn = async () => {
        const client = await SigningStargateClient.connect(chainInfo?.rpc)
        
        let result = await getKeplrWalletAmino(chainInfo?.chainId);
        const bodyBytes = fromBase64(signData[from].bodyBytes);

        let currentSignatures = []
        for (let s in signData) {
        let obj = {
                address: s,
                signature: signData[s].signatures
            }

            currentSignatures = [...currentSignatures, obj]
        }

        const multisigAcc = await client.getAccount(multisig.address)

        let mapData = JSON.parse(multisig.pubkeyJSON)
        const signedTx = makeMultisignedTx(
            mapData,
            multisigAcc.sequence,
            txInfo.fee,
            bodyBytes,
            new Map(currentSignatures.map((s) => [s.address, fromBase64(s.signature)])),
        );


        const broadcaster = await StargateClient.connect(chainInfo?.rpc);
        const result1 = await broadcaster.broadcastTx(
          Uint8Array.from(TxRaw.encode(signedTx).finish()),
        );
        console.log(result1);

    }

    return (
        <div>
            <div><h4>BroadcastTx</h4></div>
            <div>
                <Button onClick={() => {
                    broadcastTxn()
                }}>BroadCast Txn</Button>
            </div>
        </div>
    )
}
