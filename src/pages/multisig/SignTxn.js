import { Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Registry } from '@cosmjs/proto-signing';
import { toBase64 } from '@cosmjs/encoding';

async function getKeplrWalletAmino(chainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts[0]];
}

export default function SignTxn() {
    const from = useSelector((state) => state.wallet.address);

    const chainInfo = useSelector((state) => state.wallet.chainInfo);


    const signTheTx = async () => {
        const client = await SigningStargateClient.connect(chainInfo?.rpc)

        const chainId = await client.getChainId()
        let result = await getKeplrWalletAmino(chainInfo?.chainId);
        var wallet = result[0]
        var account = result[1]

        const signingClient = await SigningStargateClient.offline(wallet);

        const accountInfo = await client.getAccount(from)

        let unSignedTxn = localStorage.getItem('un_signed_tx') && JSON.parse(localStorage.getItem('un_signed_tx')) || {};

        console.log('unsigned txnssss', unSignedTxn)
        let accountNumber = accountInfo?.accountNumber;

        const signerData = {
            accountNumber: accountNumber,
            sequence: accountInfo.sequence,
            chainId: chainInfo?.chainId,
        };

        console.log('signer data-----------', signerData, unSignedTxn, from)

        const { bodyBytes, signatures } = await signingClient.sign(
            from,
            unSignedTxn.msgs,
            unSignedTxn.fee,
            unSignedTxn.memo,
            signerData,
        );

        console.log('body bypes----', bodyBytes)
        console.log('singare utesssssssss', signatures)
        console.log('ddddddddddddddddddddddd', toBase64(bodyBytes), toBase64(signatures[0]))
        let obj = localStorage.getItem('sign') && JSON.parse(localStorage.getItem('sign')) || {};
        obj[from] = {
            bodyBytes: toBase64(bodyBytes),
            signatures: toBase64(signatures[0])
        }
        localStorage.setItem('sign', JSON.stringify(obj))
    }

    return (
        <div>
            <div>
                <h5>Sign The Txn</h5>
            </div>
            <div>
                <Button onClick={()=>{
                    signTheTx()
                }}>Sign the txn</Button>
            </div>
        </div>
    )
}
