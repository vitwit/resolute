import { Button, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { txAuthSend } from '../features/bank/bankSlice';
import {
    setError, resetError, setTxHash, resetTxHash
  } from './../features/common/commonSlice';

export const Send = () => {
    const from = useSelector((state) => state.wallet?.address);
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const sendTx = useSelector((state) => state.bank.tx.send);
    const dispatch = useDispatch();

    const { handleSubmit, control } = useForm({
        defaultValues: {}
    });


    useEffect(() => {
        dispatch(resetError())
        dispatch(resetTxHash())
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
                message: sendTx.errMsg
            }))
        }
    }, [sendTx])

    const onSubmit = data => {
        dispatch(txAuthSend({
            from: from,
            to: data.recipient,
            amount: Number(data.amount) * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
            memo: data.memo? data.memo : "",
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: 25000
        }))
       
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="recipient"
                                control={control}
                                rules={{ required: 'Recipient is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) =>
                                    <TextField
                                        label="Recipient"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        fullWidth
                                    />}
                            />
                            <br />
                            <br />
                            <Controller
                                name="amount"
                                control={control}
                                rules={{ required: 'Amount is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) =>
                                    <TextField
                                        label="Amount"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        fullWidth
                                    />}
                            />
                            <br />
                            <br />
                            <Controller
                                name="memo"
                                control={control}
                                render={({ field: { onChange, value } }) =>
                                    <TextField
                                        label="Memo (Optional)"
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                    />
                                }
                            />

                            <br />
                            <br />

                            <Button
                                type='submit'
                                variant='outlined'
                                disableElevation
                                disabled={sendTx.status === 'pending'}
                                size='medium'
                            >{sendTx.status === 'pending' ? 'Loading...' : 'Send'}</Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item md={3} xs={1}></Grid>
        </>
    );
}