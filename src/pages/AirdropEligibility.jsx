import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getClaimRecords, resetState } from './../features/airdrop/airdropSlice';
import { getNetworks } from '../utils/networks';
import { resetError, setError } from '../features/common/commonSlice';

function getPasgNetwork() {
    const networks = getNetworks();
    for (let i=0;i<networks.length;i++) {
        const network = networks[i];
        if (network.currencies[0].coinMinimalDenom === "upasg") {
            return network;
        }
    }

    return null;
}

export default function AirdropEligibility() {
    const claimRecords = useSelector((state) => state.airdrop.claimRecords);
    const status = useSelector((state) => state.airdrop.status);
    const errMsg = useSelector((state) => state.airdrop.errMsg);
    const walletAddress = useSelector((state) => state.wallet.address);
    const  {lcd, currencies}= getPasgNetwork();

    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            address: '',
        }
    });

    useEffect(() => {
        dispatch(resetError());
    }, []);


    useEffect(() => {
        if (walletAddress.startsWith("pasg")) {
            dispatch(resetState())
            setValue("address", walletAddress)
        }
    }, [walletAddress]);

    useEffect(() => {
        if (errMsg !== "" && status === 'rejected') {
            dispatch(setError({
                type: 'error',
                message: errMsg
            }))
        }
    }, [errMsg]);

    const dispatch = useDispatch();
    const onSubmit = data => {
        dispatch(getClaimRecords({
            baseURL: lcd,
            address: data.address,
        }))
    }

    const getClaimableAmount = (records) => {
        let total = 0.0
        for (let i = 0; i < records.length; i++) {
            const record = records[i]
            total += parseFloat(record.amount / (10.0 ** currencies[0].coinDecimals))
        }

        return `${parseFloat(total.toFixed(6))} ${currencies[0].coinDenom}`
    }

    return (
        <>
            <br />
            <br />
            <br />
            <Grid container>
                <Grid item xs={2} md={3}></Grid>
                <Grid item xs={8} md={6} >
                    <Paper elevation={0} style={{ padding: 24 }}>
                        <Typography
                            variant='h5'
                            color='text.primary'
                            fontWeight={700}
                        >
                            Passage3d Airdrop
                        </Typography>
                        <br />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="address"
                                control={control}
                                rules={{ required: 'Address is required' }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        required
                                        label="Address"
                                        fullWidth
                                    />}
                            />
                            <br />
                            <br />
                            <Button
                                type='submit'
                                variant='outlined'
                                disableElevation
                                disabled={status === 'pending'}
                                size='medium'
                            >
                                {status === 'pending' ? <CircularProgress size={25} /> : `Check Airdrop`}
                            </Button>

                        </form>
                        <div
                            style={{ marginTop: 16 }}
                        >
                            {
                                status === 'idle' ?
                                    claimRecords?.address ?
                                        <Typography
                                            variant='body1'
                                            color='text.primary'
                                            fontWeight={600}
                                        >
                                            Total tokens: {getClaimableAmount(claimRecords?.claimable_amount)}
                                        </Typography>
                                        :
                                        <Typography
                                            variant='body1'
                                            color='text.primary'
                                            fontWeight={600}
                                        >
                                            You are not eligible for the Airdrop
                                        </Typography>
                                    :
                                    <></>
                            }
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={2} md={3}></Grid>
            </Grid>
        </>
    );
}