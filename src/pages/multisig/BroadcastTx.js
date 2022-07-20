import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { Button } from '@mui/material'
import React, {useState} from 'react'

import { StargateClient, SigningStargateClient, makeMultisignedTx } from "@cosmjs/stargate";
import { useDispatch, useSelector } from 'react-redux';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { setError } from '../../features/common/commonSlice';
import { updateTxn } from '../../features/multisig/multisigSlice';

async function getKeplrWalletAmino(chainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSignerOnlyAmino(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts[0]];
}

export default function BroadcastTx({ tx, signatures, multisigAccount }) {
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    const from = useSelector((state) => state.wallet.address);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);

    const broadcastTxn = async () => {
        setLoad(true);
        const client = await SigningStargateClient.connect(chainInfo?.config?.rpc);
        

        let result = await getKeplrWalletAmino(chainInfo?.config?.chainId);
        const fromAccount = signatures.filter(s => s.address === from)

        const bodyBytes = fromBase64(signatures[0].bodyBytes?signatures[0].bodyBytes: signatures[0].bodybytes);

        let currentSignatures = []
        signatures.map(s => {
            let obj = {
                address: s.address,
                signature: s.signature
            }

            currentSignatures = [...currentSignatures, obj]
        })

        const multisigAcc = await client.getAccount(multisigAccount.address)

        let mapData = multisigAccount.pubkeyJSON || {}

        let newMapObj = {};
        let pubkeys = [];

        mapData?.value?.pubkeys.map(p => {
            let obj = {
                type: p?.type,
                value: p?.value
            }
            pubkeys = [...pubkeys, obj];
        })

        newMapObj = {
            type: mapData?.type,
            value: {
                threshold: mapData?.value?.threshold,
                pubkeys: pubkeys
            }
        }

        const signedTx = makeMultisignedTx(
            newMapObj,
            multisigAcc.sequence,
            tx?.fee,
            bodyBytes,
            new Map(currentSignatures.map((s) => [s.address, fromBase64(s.signature)])),
        );

        try {
            const broadcaster = await StargateClient.connect(chainInfo?.config?.rpc);
            const result1 = await broadcaster.broadcastTx(
                Uint8Array.from(TxRaw.encode(signedTx).finish()),
            );
            setLoad(false);

            dispatch(updateTxn(tx?._id))

            console.log(result1);
        } catch (err) {
            setLoad(false);
            dispatch(setError({
                type: 'error',
                message: err.message
            }))
        }
    }

    return (
        <Button variant="contained" disableElevation className='pull-right' onClick={() => {
            broadcastTxn()
        }}>{load?'Loading...': 'BroadCast'}</Button>
    )
}
