import React from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';

export function PeriodicFeegrant(props) {
    const {loading, onGrant} = props;

    const date = new Date()
    const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);


    const { handleSubmit, control, getValues } = useForm({
        defaultValues: {
            grantee: '',
            spendLimit: 0,
            expiration: expiration,
            period: 1,
            periodSpendLimit: 0,
        }
    });

    const onFormSubmit = (data) => {
        onGrant({
            grantee: data.grantee,
            spendLimit: Number(data.spendLimit) === 0 ? null : data.spendLimit,
            expiration: data.expiration,
            period: data.period,
            periodSpendLimit: data.periodSpendLimit,
        })
    }


    return (
        <>
            <form onSubmit={handleSubmit(onFormSubmit)}>
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
                <div>
                    <Controller
                        name="spendLimit"
                        control={control}
                        rules={{
                            validate: (value) => {
                                return Number(value) >= 0
                            }
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                            <TextField
                                label="Spend Limit"
                                value={value}
                                onChange={onChange}
                                inputMode='decimal'
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
                    render={({ field: { onChange, value }, fieldState: { error } }) =>
                        <LocalizationProvider
                            dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                disablePast
                                renderInput={(props) => <TextField
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
                <br />

                <Controller
                    name="period"
                    control={control}
                    rules={{ required: 'Period is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) =>
                        <TextField
                            label="Period"
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
                    name="periodSpendLimit"
                    control={control}
                    rules={{
                        required: 'period spend limit is required',
                        validate: (value) => {
                            if (Number(getValues("spendLimit")) > 0) {
                                return Number(getValues("spendLimit")) >= Number(value)
                            }

                            return Number(value) > 0
                        }
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) =>
                        <TextField
                            label="Period Spend Limit"
                            value={value}
                            required
                            onChange={onChange}
                            inputMode='decimal'
                            error={!!error}
                            helperText={error ? error.message.length === 0 ?
                                Number(getValues("spendLimit")) > 0 && Number(value) > Number(getValues("spendLimit")) ? 'Period spend limit is greater than spend limit' : 'Invalid period spend limit' : error.message : null}
                            fullWidth
                            InputProps={{
                                endAdornment: <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                            }}
                        />}
                />

                <br />

                <Button
                    style={{ marginTop: 32 }}
                    variant="outlined"
                    type='submit'
                    disabled={loading === 'pending'}
                >
                    {loading === 'pending' ? "Please wait..." : "Grant"}
                </Button>
            </form>
        </>
    )
}


PeriodicFeegrant.propTypes = {
    loading: PropTypes.string.isRequired,
    onGrant: PropTypes.func.isRequired,
};