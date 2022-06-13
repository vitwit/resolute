import { Button, TextField, Paper, Typography, Grid, InputAdornment } from '@mui/material';
import React, { useState } from 'react';
import { calculateFee } from "@cosmjs/stargate";
import { useSelector } from 'react-redux';
import { Decimal } from "@cosmjs/math";

export default function CreateTxn({ handleNext }) {
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const currency = chainInfo?.currencies[0];

    const [obj, setObj] = useState({});

    const createTransaction = ({ toAddress, amount, memo, gas }) => {
        const multisig = localStorage.getItem('multisig') && JSON.parse(localStorage.getItem('multisig')) || {};

        const amountInAtomics = Decimal.fromUserInput(
            amount,
            Number(chainInfo.currencies[0].coinDecimals),
        ).atomics;

        const msgSend = {
            fromAddress: multisig.address,
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

        const fee = calculateFee(Number(100000), '0.000001stake');

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
        <Grid container>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={10} md={8}>
                <Paper elevation={0} style={{ padding: 24 }}>
                    <Typography
                        variant='h6'
                        fontWeight={600}
                        color='text.primary'
                    >
                        Create Transaction
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="toAddress"
                            value={obj.toAddress}
                            onChange={handleChange}
                            label="To Address"
                            fullWidth
                            style={{ marginTop: 8, marginBottom: 8 }}
                        />
                        <TextField
                            name="amount" value={obj.amount} onChange={handleChange}
                            label="Amount"
                            fullWidth
                            style={{ marginTop: 8, marginBottom: 8 }}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                            }}
                        />
                        <TextField
                            name="gas" value={obj.gas} onChange={handleChange}
                            label="Gas"
                            fullWidth
                            style={{ marginTop: 8, marginBottom: 8 }}
                        />
                        <TextField
                            name="memo" value={obj.memo} onChange={handleChange}
                            label="Memo"
                            fullWidth
                            style={{ marginTop: 8, marginBottom: 8 }}
                        />
                        <Button type="submit" variant='contained' disableElevation
                            style={{ marginTop: 16 }}
                            className='button-capitalize-title'

                        >Create Transaction</Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={1} md={2}></Grid>
        </Grid>

    )
}
