import { Button, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { txBankSend } from '../features/bank/bankSlice';
import {
    resetError, resetTxHash, setError
} from './../features/common/commonSlice';
import { totalBalance } from '../utils/denom';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

export const Send = () => {
    const from = useSelector((state) => state.wallet.address);
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const sendTx = useSelector((state) => state.bank.tx);
    const balance = useSelector((state) => state.bank.balance);
    const [available, setBalance] = useState(0);

    const dispatch = useDispatch();
    const { handleSubmit, control, setValue } = useForm({
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

    const onSubmit = data => {
        const amount = Number(data.amount);
        if (Number(available) < (amount + Number(25000 / (10 ** currency.coinDecimals)))) {
            dispatch(setError({
                type: 'error',
                message: 'Not enough balance'
            }))
        } else {
            dispatch(txBankSend({
                from: from,
                to: data.recipient,
                amount: Number(data.amount) * (10 ** currency.coinDecimals),
                denom: currency.coinMinimalDenom,
                chainId: chainInfo.chainId,
                rpc: chainInfo.rpc,
                feeAmount: 25000,
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
                                    className='hover-link'
                                    onClick={() => setValue("amount", available)}
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
                                                endAdornment:
                                                    <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                                            }}
                                        />}
                                />
                                {/* <div
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
                                        </div> */}

                                <div>
                                    <br />
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        disableElevation
                                        disabled={sendTx.status === 'pending'}
                                        size='medium'
                                    >
                                        {sendTx.status === 'pending' ? <CircularProgress size={25}/> : 'Send'}
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