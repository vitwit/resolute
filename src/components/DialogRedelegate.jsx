import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";

function parseValidators(active, inactive, validator) {
    let result = []

    for (const v in active) {
        if (v !== validator?.operator_address)
            result.push({
                addr: v,
                label: active[v].description.moniker
            })
    }

    for (const v in inactive) {
        if (v !== validator?.operator_address)
            result.push({
                addr: v,
                label: inactive[v].description.moniker
            })
    }

    return result
}

function parseDelegation(delegations, validator, currency) {
    let result = 0.0
    delegations.map((item) => {
        if (item.delegation.validator_address === validator?.operator_address) {
            result += parseFloat(item.delegation.shares) / (10 ** currency?.coinDecimals).toFixed(6)
        }
    })

    return result
}


export function DialogRedelegate(props) {
    const { onClose, open, active, inactive, validator, delegations, currency, onRedelegate, loading } = props;

    const targetValidators = parseValidators(active, inactive, validator);

    const delegationShare = parseDelegation(delegations, validator, currency);

    const handleClose = () => {
        onClose();
    };

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            amount: 0,
            destination: null,
        }
    });


    const onSubmit = data => {
        onRedelegate({
            amount: data.amount,
            dest: data.destination.addr,
            src: validator?.operator_address
        })
    }

    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Typography
                            variant='h6'
                            color='text.primary'
                            fontWeight={800}
                        >
                            {validator?.description?.moniker}
                        </Typography>
                        <Typography
                            variant='body1'
                            color='text.secondary'
                        >
                            Commission:&nbsp;{(parseFloat(validator?.commission?.commission_rates.rate) * 100.0).toFixed(2)}%
                        </Typography>
                        <hr />
                        <br />
                        <div>

                            <Controller
                                name="destination"
                                control={control}
                                defaultValue={null}
                                rules={{ required: 'Target validator is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) =>

                                    <Autocomplete
                                        disablePortal
                                        label="destination"
                                        value={value}
                                        size='small'
                                        isOptionEqualToValue={(option, value) => option.addr === value.addr}
                                        options={targetValidators}
                                        onChange={(event, item) => {
                                            onChange(item);
                                        }}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            required
                                            placeholder='select validator'
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            label="destination" />}
                                    />
                                } />
                        </div>
                        <Typography
                            color='text.primary'
                            fontWeight={600}
                            style={{ marginTop: 16 }}
                        >
                            Available for Redelegation
                        </Typography>
                        <Typography
                            color='text.primary'
                            variant='body1'
                            className='hover-link'
                            onClick={() => setValue("amount", delegationShare)}
                        >
                            {delegationShare}
                        </Typography>
                        <div
                            style={{ marginTop: 16 }}
                        >

                            <Controller
                                name="amount"
                                control={control}
                                rules={{
                                    required: 'Amount is required',
                                    validate: (value) => {
                                        return Number(value) <= delegationShare
                                    }
                                }}
                                render={({ field, fieldState: { error } }) =>
                                    <TextField
                                        {...field}
                                        required
                                        label="Amount"
                                        fullWidth
                                        size='small'
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                                        }}
                                        error={!!error}
                                        helperText={errors.amount?.type === 'validate' ? 'Invalid amount' : error?.message}
                                    />}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant='outlined'
                            color='secondary'
                            className='button-capitalize-title'
                            disableElevation
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            disableElevation
                            type='submit'
                            className='button-capitalize-title'
                            disabled={loading === 'pending'}
                        >
                            {loading === 'pending' ? <CircularProgress size={25}/> : 'Redelegate'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

DialogRedelegate.propTypes = {
    onClose: PropTypes.func.isRequired,
    onRedelegate: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    loading: PropTypes.string.isRequired,
    validator: PropTypes.object.isRequired,
    delegations: PropTypes.array.isRequired,
    active: PropTypes.object.isRequired,
    inactive: PropTypes.object.isRequired,
    currency: PropTypes.object.isRequired,
};
