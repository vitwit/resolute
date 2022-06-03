import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getClaimRecords, resetState, getClaimParams, txClaimAction } from './../features/airdrop/airdropSlice';
import { getMainNetworks, getTestNetworks } from '../utils/networks';
import { useNavigate } from "react-router-dom";
import { resetError, setError } from '../features/common/commonSlice';
import AirdropProgress from '../components/AirdropProgress';
import {fromBech32, toHex, toBech32, fromHex} from "@cosmjs/encoding"

function getPasgNetwork() {
    const mainNetworks = getMainNetworks();
    const testNetworks = getTestNetworks();
    for (let i = 0; i < mainNetworks.length; i++) {
        const network = mainNetworks[i];
        if (network.currencies[0].coinMinimalDenom === "upasg") {
            return network;
        }
    }
    for (let i = 0; i < testNetworks.length; i++) {
        const network = testNetworks[i];
        if (network.currencies[0].coinMinimalDenom === "upasg") {
            return network;
        }
    }

    return null;
}

function getClaimPercentage(claimRecords) {
    const actions = claimRecords?.action_completed
    let claimed = 0
    for (let action of actions) {
        if (action === true) {
            claimed++
        }
    }
    return Math.floor((claimed / 3) * 100)
}

function getPassageAddress(address) {
    try {
        const hexAddress = toHex(fromBech32(address).data)
        return [toBech32("pasg", fromHex(hexAddress)), null]
    } catch (err) {
        return [null, err.message]
    }
}

export default function AirdropEligibility() {
    const claimRecords = useSelector((state) => state.airdrop.claimRecords);
    const params = useSelector((state) => state.airdrop.params);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const status = useSelector((state) => state.airdrop.claimStatus);
    const errMsg = useSelector((state) => state.airdrop.errMsg);
    const txStatus = useSelector((state) => state.airdrop.tx.status);
    const walletAddress = useSelector((state) => state.wallet.address);
    const { lcd, currencies } = getPasgNetwork();
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);

    const { handleSubmit, control, setValue, getValues } = useForm({
        defaultValues: {
            address: '',
        }
    });

    useEffect(() => {
        if (chainInfo.showAirdrop) {
            dispatch(resetError());
            if (lcd !== "") {
                dispatch(getClaimParams({
                    baseURL: lcd
                }));
            }
            return () => {
                dispatch(resetError());
                dispatch(resetState());
            }
        }
    }, []);

    useEffect(() => {
        if (txStatus === 'idle') {
            if (walletAddress.length > 0)
                dispatch(getClaimRecords({
                    baseURL: lcd,
                    address: walletAddress,
                }))
        }
    }, [txStatus]);


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

    let navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }

    const dispatch = useDispatch();
    const onSubmit = data => {
        const [address, err] = getPassageAddress(data.address)
        if (err) {
            dispatch(setError({
                type: 'error',
                message: err
            }))
        } else {
            dispatch(getClaimRecords({
                baseURL: lcd,
                address: address,
            }))
        }
    }

    const getClaimableAmount = (records) => {
        let total = 0.0
        for (let i = 0; i < records.length; i++) {
            const record = records[i]
            total += parseFloat(record.amount / (10.0 ** currencies[0].coinDecimals))
        }

        return `${parseFloat(total.toFixed(6))} ${currencies[0].coinDenom}`
    }

    const txAction1 = () => {
        if (walletAddress.length > 0) {
            dispatch(txClaimAction({
                address: walletAddress,
                denom: currency?.coinMinimalDenom,
                chainId: chainInfo.chainId,
                rpc: chainInfo.rpc,
                feeAmount: chainInfo?.config.gasPriceStep.average,
                baseURL: chainInfo?.lcd,
            }))
        } else {
            alert("Wallet is not connected");
        }
    }

    return (
        <>
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
                                    claimRecords.address?.length > 0 ?
                                        <>
                                            <Typography
                                                variant='body1'
                                                color='text.primary'
                                                fontWeight={600}
                                            >
                                                Claimable tokens: {getClaimableAmount(claimRecords?.claimable_amount)}
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                color='text.primary'
                                                fontWeight={600}
                                            >
                                                {chainInfo.airdropMessage}
                                            </Typography>
                                        </>
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
            {
                claimRecords?.address === getValues().address && chainInfo.airdropActions.length > 0 ?
                    <>
                        <br />
                        <Paper
                            style={{ padding: 16, textAlign: 'left' }}
                            elevation={0}
                        >
                            <Typography
                                variant='h6'
                                color='text.primary'
                                style={{ marginBottom: 12 }}
                            >
                                My Progress
                            </Typography>
                            <AirdropProgress value={getClaimPercentage(claimRecords)} />
                        </Paper>
                        <br />
                        <Paper
                            elevation={0}
                            style={{ padding: 16, textAlign: 'left' }}
                        >
                            <Typography
                                color='text.primary'
                                variant='h5'
                                fontWeight={600}

                            >
                                Missions
                            </Typography>
                            {
                                chainInfo.airdropActions.map((item, index) => (
                                    item.type === "action" ?
                                        <Paper
                                            elevation={1}
                                            className='claim-item'
                                        >
                                            <Typography
                                                color='text.primary'
                                                variant='h6'
                                                fontWeight={600}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Button
                                                variant='contained'
                                                disableElevation
                                                onClick={() => {
                                                    txAction1()
                                                }}
                                                disabled={(params?.airdrop_enabled === false && new Date(params?.airdrop_start_time) >= new Date())
                                                    || (claimRecords?.action_completed.length >= index && claimRecords?.action_completed[index] === true)
                                                    || txStatus === 'pending'}
                                            >
                                                {
                                                    claimRecords?.action_completed.length >= index && claimRecords?.action_completed[index] === true ?
                                                        `Claimed`
                                                        :

                                                        txStatus === 'pending' ?
                                                            <CircularProgress size={25} />
                                                            :
                                                            `Claim`
                                                }
                                            </Button>
                                        </Paper>
                                        :
                                        <Paper
                                            elevation={1}
                                            className='claim-item'
                                        >
                                            <Typography
                                                color='text.primary'
                                                variant='h6'
                                                fontWeight={600}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Button
                                                variant='contained'
                                                disableElevation
                                                onClick={() => {
                                                    navigateTo(item.redirect)
                                                }}
                                                disabled={(claimRecords?.action_completed.length >= index && claimRecords?.action_completed[index] === true)}
                                            >
                                                {
                                                    claimRecords?.action_completed.length >= index && claimRecords?.action_completed[index] === true ?
                                                        `Claimed`
                                                        :
                                                        `Claim`
                                                }
                                            </Button>
                                        </Paper>
                                )
                                )
                            }
                        </Paper>
                    </>
                    :
                    <></>
            }
        </>

    );
}