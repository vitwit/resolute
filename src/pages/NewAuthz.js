import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import { authzMsgTypes } from '../utils/authorizations';
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { amountToMinimalValue } from '../utils/util';
import { txAuthzGeneric, txAuthzSend, resetAlerts } from '../features/authz/authzSlice';
import {
    resetError, resetTxHash, setError
} from './../features/common/commonSlice';
import InputAdornment from '@mui/material/InputAdornment';


export default function NewAuthz() {
    const address = useSelector((state) => state.wallet.address);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const authzTx = useSelector((state) => state.authz.tx);
    const grantsToMe = useSelector((state) => state.authz.grantsToMe);
    const grantsByMe = useSelector((state) => state.authz.grantsByMe);
    const dispatch = useDispatch();


    useEffect(() => {
        if (grantsToMe.errMsg !== "" && grantsToMe.status === "rejected") {
            dispatch(setError({
                type: "error",
                message: grantsToMe.errMsg
            }))
        }

        if (grantsByMe.errMsg !== "" && grantsByMe.status === "rejected") {
            dispatch(setError({
                type: "error",
                message: grantsByMe.errMsg
            }))
        }
    }, [grantsByMe.errMsg, grantsToMe.errMsg]);

    useEffect(() => {
        dispatch(resetAlerts());
        dispatch(resetError());
        dispatch(resetTxHash());
    }, []);

    const [selected, setSelected] = useState('send')
    let date = new Date()
    let expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);


    const { handleSubmit, control } = useForm({
        defaultValues: {
            grantee: '',
            spendLimit: 1,
            expiration: expiration,
            typeUrl: ''
        }
    });

    const onSendSubmit = data => {
        dispatch(txAuthzSend({
            granter: address,
            grantee: data.grantee,
            spendLimit: amountToMinimalValue(data.spendLimit, chainInfo.currencies[0]),
            expiration: data.expiration,
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo?.config.gasPriceStep.average,
        }))
    };

    const onGenericSubmit = data => {
        dispatch(txAuthzGeneric({
            granter: address,
            grantee: data.grantee,
            typeUrl: data.typeURL?.typeURL,
            expiration: data.expiration,
            denom: currency.coinMinimalDenom,
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: chainInfo.gasPriceStep.average,
        }))
    };

    const onChange = (type) => {
        setSelected(type);
    }

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button
                    variant={selected === 'send' ? 'contained' : 'outlined'}
                    onClick={() => onChange('send')}
                >
                    Send
                </Button>
                <Button
                    variant={selected === 'generic' ? 'contained' : 'outlined'}
                    onClick={() => onChange('generic')}
                >
                    Generic
                </Button>
            </ButtonGroup>
            <br />
            <br />
            <Grid container spacing={2}>
                <br />
                <Grid item md={3} sm={2}></Grid>
                <Grid item md={6} sm={8}>
                    <Paper elevation={0} style={{ padding: 32 }}>

                        {
                            selected === 'send' ?
                                <form onSubmit={handleSubmit(onSendSubmit)}>
                                    <Controller
                                        name="grantee"
                                        control={control}
                                        rules={{ required: 'Grantee is required' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
                                                label="Grantee"
                                                value={value}
                                                required
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                fullWidth
                                            />}
                                    />
                                    <br />
                                    <br />
                                    <div >
                                        <Controller
                                            defaultValue={1}
                                            name="spendLimit"
                                            control={control}
                                            rules={{
                                                required: 'Spend limit is required', validate: (value) => {
                                                    return Number(value) > 0
                                                }
                                            }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) =>
                                                <TextField
                                                    label="Spend Limit"
                                                    value={value}
                                                    required
                                                    onChange={onChange}
                                                    type='number'
                                                    error={!!error}
                                                    helperText={error ? error.message.length === 0 ? 'Invalid spend limit' : error.message : null}
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                                                    }}
                                                />}
                                        />
                                    </div>
                                    <Controller
                                        name="expiration"
                                        control={control}
                                        rules={{ required: 'Expiration is required' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}>
                                                <DateTimePicker
                                                    disablePast
                                                    renderInput={(props) => <TextField
                                                        required
                                                        style={{ marginTop: 32 }}
                                                        fullWidth {...props} />}
                                                    label="Expiration"
                                                    value={value}
                                                    error={!!error}
                                                    onChange={onChange}
                                                    helperText={error ? error.message : null}
                                                />
                                            </LocalizationProvider>
                                        }
                                    />
                                    <br />

                                    <Button
                                        type='submit'
                                        disabled={authzTx?.status === 'pending'}
                                        style={{ marginTop: 32 }}
                                        variant="outlined"
                                    >
                                        {authzTx?.status === 'pending' ?
                                            <CircularProgress
                                                size={25}
                                            />
                                            : 'Grant'}
                                    </Button>
                                </form>
                                :
                                ''
                        }

                        {
                            selected === 'generic' ?
                                <>
                                    <form onSubmit={handleSubmit(onGenericSubmit)}>
                                        <Controller
                                            name="grantee"
                                            control={control}
                                            rules={{ required: 'Grantee is required' }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) =>
                                                <TextField
                                                    label="Grantee"
                                                    value={value}
                                                    required
                                                    onChange={onChange}
                                                    error={!!error}
                                                    helperText={error ? error.message : null}
                                                    fullWidth
                                                />}
                                        />
                                        <br />
                                        <br />
                                        <Controller
                                            name="typeURL"
                                            control={control}
                                            defaultValue={null}
                                            rules={{ required: 'Message type is required' }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) =>

                                                <Autocomplete
                                                    disablePortal
                                                    fullWidth
                                                    variant="outlined"
                                                    required
                                                    options={authzMsgTypes()}
                                                    isOptionEqualToValue={(option, value) => option.typeUrl === value.typeUrl}
                                                    label="Type"
                                                    value={value}
                                                    onChange={(event, item) => {
                                                        onChange(item);
                                                    }}
                                                    renderInput={(params) =>
                                                        <TextField {...params}
                                                            error={!!error}
                                                            required
                                                            placeholder='Select msg type'
                                                            helperText={error ? error.message : null}
                                                        />} />
                                            } />
                                        <Controller
                                            name="expiration"
                                            control={control}
                                            rules={{ required: 'Expiration is required' }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) =>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDateFns}>
                                                    <DateTimePicker
                                                        disablePast
                                                        renderInput={(props) =>
                                                            <TextField
                                                                required
                                                                style={{ marginTop: 32 }}
                                                                fullWidth {...props}
                                                            />}
                                                        label="Expiration"
                                                        value={value}
                                                        error={!!error}
                                                        onChange={onChange}
                                                        helperText={error ? error.message : null}
                                                    />
                                                </LocalizationProvider>
                                            }
                                        />
                                        <br />

                                        <Button
                                            type='submit'
                                            style={{ marginTop: 32 }}
                                            disabled={authzTx?.status === 'pending'}
                                            variant="outlined"
                                        >
                                            {authzTx?.status === 'pending' ? <CircularProgress size={25}/> : 'Grant'}
                                        </Button>
                                    </form>
                                </>
                                :
                                ''
                        }

                    </Paper>
                </Grid>
                <Grid item md={3} sm={2}></Grid>
            </Grid>
        </>

    );
}
