import { Autocomplete, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import React from 'react';
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
    const { onClose, open, active, inactive, validator, delegations, currency } = props;

    const targetValidators = parseValidators(active, inactive, validator);

    const delegationShare = parseDelegation(delegations, validator, currency);

    const handleClose = () => {
        onClose();
    };

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            amount: 0,
            destination: {},
        }
    });


    const onSubmit = data => {
        console.log(data)
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
                                        isOptionEqualToValue={(option, value) => option.addr === value.addr}
                                        label="destination"
                                        value={value}
                                        onChange={(event, item) => {
                                            onChange(item);
                                        }}
                                        id="combo-box-demo"
                                        size='small'
                                        options={targetValidators}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField
                                            {...params}
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
                                            endAdornment: <InputAdornment position="start">STAKE</InputAdornment>,
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
                        >
                            Redelegate
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

DialogRedelegate.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    validator: PropTypes.object.isRequired,
    delegations: PropTypes.array.isRequired,
    active: PropTypes.object.isRequired,
    inactive: PropTypes.object.isRequired,
    currency: PropTypes.object.isRequired,
};
