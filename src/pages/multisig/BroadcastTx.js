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

    
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    
    const broadcastTxn = async () => {
        const client = await SigningStargateClient.connect(chainInfo?.rpc)
        
        const chainId = await client.getChainId()
        let result = await getKeplrWalletAmino(chainInfo?.chainId);
        var wallet = result[0]
        var account = result[1]

        const base64 = toBase64(signData[from].bodyBytes)

        const bodyBytes = fromBase64(base64);

        let currentSignatures = []
        for (let s in signData) {
            let obj = {
                address: s,
                signature: signData[s].signatures
            }

            currentSignatures = [...currentSignatures, obj]
        }

        console.log('crrent signareuessss', currentSignatures, account.pubkey)

        let multiSignatureAddr = localStorage.getItem('multisigAddr') && JSON.parse(localStorage.getItem('multisigAddr'))

        console.log('ssssssssssssssssss',  multiSignatureAddr.pubkeyJSON)

        let mapData = JSON.parse(multiSignatureAddr.pubkeyJSON)
        console.log('s111111111',  mapData)

        const signedTx = makeMultisignedTx(
            mapData,
            txInfo.sequence,
            txInfo.fee,
            bodyBytes,
            new Map(currentSignatures.map((s) => [s.address, fromBase64(s.signature)])),
        );


        console.log('signed txxxxxxxxx', signedTx)

        const broadcaster = await StargateClient.connect(chainInfo?.rpc);
        const result1 = await broadcaster.broadcastTx(
          Uint8Array.from(TxRaw.encode(signedTx).finish()),
        );

        console.log('signed tattttttttt', result1)
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
