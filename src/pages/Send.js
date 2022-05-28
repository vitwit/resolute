import { Button, Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { txAuthSend } from '../features/bank/bankSlice';
import {
    resetError, setTxHash, resetTxHash, setError
} from './../features/common/commonSlice';
import { totalBalance } from '../utils/denom';
import InputAdornment from '@mui/material/InputAdornment';

export const Send = () => {
    const feepayer = localStorage.getItem("fee_payer")
    const from = useSelector((state) => state.wallet?.address);
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const sendTx = useSelector((state) => state.bank.tx.send);
    const balance = useSelector((state) => state.bank.balance);
    const [available, setBalance] = useState(0);

    const dispatch = useDispatch();

    const { handleSubmit, control } = useForm({
        defaultValues: {
            amount: 0,
            recipient: '',
        }
    });


    useEffect(() => {
        dispatch(resetError())
        dispatch(resetTxHash())
        setBalance(totalBalance(balance.balance, chainInfo.currencies[0]?.coinDecimals));
    }, []);


    useEffect(() => {
        if (sendTx?.txHash !== '') {
            dispatch(setTxHash({
                hash: sendTx?.txHash,
            }))
        }

        if (sendTx?.errMsg !== '') {
            dispatch(setError({
                type: 'error',
                message: sendTx?.errMsg
            }))
        }
    }, [sendTx]);

    const [feePayerEnable, setFeePayerEnable] = useState(false);

    const handleFeePayer = (e) => {
        if (e.target.checked) {
            setFeePayerEnable(true);
        } else {
            setFeePayerEnable(false);
        }
    }

    const onSubmit = data => {
        dispatch(resetError())
        const amount = Number(data.amount);
        if (Number(available) < (amount + Number(25000 / (10 ** currency.coinDecimals)))) {
            dispatch(setError({
                type: 'error',
                message: 'Not enough balance'
            }))
        } else {
            dispatch(txAuthSend({
                from: from,
                to: data.recipient,
                amount: Number(data.amount) * (10 ** currency.coinDecimals),
                denom: currency.coinMinimalDenom,
                memo: data.memo ? data.memo : "",
                chainId: chainInfo.chainId,
                rpc: chainInfo.rpc,
                feeAmount: 25000,
                feePayer: feePayerEnable ? feepayer : ""
            }))
        }
    };

    return (

        <>
            <Grid container>
                <Grid item md={3} xs={1}></Grid>
                <Grid item md={6} xs={10}>
                    <Paper
                        elevation={0}
                        style={{ padding: 22 }}
                    >
                        <Typography
                            color='text.primary'
                            variant='h6'
                            fontWeight={600}
                        >
                            Send
                        </Typography>
                        <br />
                        <Box

                            noValidate
                            autoComplete="off"
                            sx={{
                                '& .MuiTextField-root': { m: 1 },
                            }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <Controller
                                        name="recipient"
                                        control={control}
                                        rules={{ required: 'Recipient is required' }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                required
                                                label="Recipient"
                                                fullWidth
                                            />}
                                    />
                                </div>
                                <Typography
                                    variant='body2'
                                    color='text.primary'
                                    style={{ textAlign: 'end' }}
                                >
                                    Availabel:&nbsp;{available}{currency?.coinDenom}
                                </Typography>
                                        <Controller
                                            name="amount"
                                            control={control}
                                            rules={{ required: 'Amount is required' }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    required
                                                    label="Amount"
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                                                      }}
                                                />}
                                        />
                                        <div
                                            style={{textAlign: 'right'}}
                                        >
                                        <FormControlLabel
                                        value="Use Feegrant"
                                        control={<Checkbox 
                                            onChange={handleFeePayer}
                                        disabled // disabled={feepayer === null}
                                        />}
                                        label="Use Feegrant"
                                        labelPlacement="right"
                                        />
                                        </div>
                                <div>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        disableElevation
                                        disabled={sendTx.status === 'pending'}
                                        size='medium'
                                    >
                                        {sendTx.status === 'pending' ? 'Loading...' : 'Send'}
                                    </Button>
                                </div>
                            </form>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item md={3} xs={1}></Grid>
        </>
    );
}