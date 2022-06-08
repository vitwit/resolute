import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { calculateFee } from "@cosmjs/stargate";
import { useSelector } from 'react-redux';
import { Decimal } from "@cosmjs/math";

export default function CreateTxn({ handleNext }) {
    const from = useSelector((state) => state.wallet.address);

    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    console.log('cahin forrrrrrrrr', chainInfo)

    const [obj, setObj] = useState({});

    const createTransaction = ({ toAddress, amount, memo, gas }) => {
        const amountInAtomics = Decimal.fromUserInput(
            amount,
            Number(chainInfo.currencies[0].coinDecimals),
        ).atomics;

        const msgSend = {
            fromAddress: from,
            toAddress: toAddress,
            amount: [
                {
                    amount: amountInAtomics,
                    denom: chainInfo.currencies[0].coinMinimalDenom,
                },
            ],
        };

        const msg = {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: msgSend,
        };

        const fee = calculateFee(Number(200000), '0.03upasg');

        return {
            chainId: chainInfo?.chainId,
            msgs: [msg],
            fee: fee,
            memo: memo,
        };
    };

    const handleChange = (e) => {
        obj[e.target.name] = e.target.value;
        setObj({ ...obj });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let txn = createTransaction(obj)
        localStorage.setItem('un_signed_tx', JSON.stringify(txn))
        handleNext()
    }

    return (
        <div>
            <div><h5>Create Txn</h5></div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='m-20'>
                        <TextField
                            name="toAddress" value={obj.toAddress} onChange={handleChange}
                            label="To Address"
                            fullWidth
                        />
                    </div>
                    <div className='m-20'>
                        <TextField
                            name="amount" value={obj.amount} onChange={handleChange}
                            label="Amount"
                            fullWidth
                        />
                    </div>
                    <div className='m-20'>
                        <TextField
                            name="gas" value={obj.gas} onChange={handleChange}
                            label="Gas"
                            fullWidth
                        />
                    </div>
                    <div className='m-20'>
                        <TextField
                            name="memo" value={obj.memo} onChange={handleChange}
                            label="Memo"
                            fullWidth
                        />
                    </div>
                    <div className='m-20'>
                        <Button type="submit">Create Txn</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
