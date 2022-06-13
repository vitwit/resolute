import { Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import { SigningStargateClient } from "@cosmjs/stargate";
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
        window.keplr.defaultOptions = {
            sign: {
              preferNoSetMemo: true,
              preferNoSetFee: true,
              disableBalanceCheck: true,
            },
};
        const client = await SigningStargateClient.connect(chainInfo?.rpc)

        let result = await getKeplrWalletAmino(chainInfo?.chainId);
        var wallet = result[0]
        const signingClient = await SigningStargateClient.offline(wallet);

        let unSignedTxn = localStorage.getItem('un_signed_tx') && JSON.parse(localStorage.getItem('un_signed_tx')) || {};
        let multisig = localStorage.getItem('multisig') && JSON.parse(localStorage.getItem('multisig')) || {};
        const multisigAcc = await client.getAccount(multisig.address)

        const signerData = {
            accountNumber: multisigAcc.accountNumber,
            sequence: multisigAcc.sequence,
            chainId: chainInfo?.chainId,
        };

        const { bodyBytes, signatures } = await signingClient.sign(
            from,
            unSignedTxn.msgs,
            unSignedTxn.fee,
            unSignedTxn.memo,
            signerData,
        );

        let obj = localStorage.getItem('sign') && JSON.parse(localStorage.getItem('sign')) || {};
        obj[from] = {
            bodyBytes: toBase64(bodyBytes),
            signatures: toBase64(signatures[0])
        }
        localStorage.setItem('sign', JSON.stringify(obj));
        console.log(signatures)
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
