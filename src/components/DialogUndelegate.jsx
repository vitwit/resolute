import { Alert, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';

function parseDelegation(delegations, validator, currency) {
    let result = 0.0
    delegations.map((item) => {
        if (item.delegation.validator_address === validator?.operator_address) {
            result += parseFloat(item.delegation.shares) / (10 ** currency?.coinDecimals).toFixed(6)
        }
    })

    return result
}

export function DialogUndelegate(props) {
    const { onClose, open, params, validator, delegations, currency, onUnDelegate, loading } = props;

    const delegationShare = parseDelegation(delegations, validator, currency)

    const handleClose = () => {
        onClose();
    };

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            amount: 0,
        }
    });

    const onSubmit = data => {
        onUnDelegate({
            validator: validator.operator_address,
            amount: data.amount
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
                        <Alert
                            severity="error"
                        >
                            Once the unbonding period begins you will:
                            <ul>
                                <li>You will not receive staking rewards.</li>
                                <li>You will not be able to cancel the unbonding.</li>
                                <li>You will not be able to withdraw your funds until {Math.floor(parseInt(params?.params?.unbonding_time) / (3600 * 24))}+ days after the undelegation.</li>
                            </ul>
                        </Alert>

                        <Typography
                            color='text.primary'
                            fontWeight={600}
                            style={{ marginTop: 16 }}
                        >
                            Available for Undelegation
                        </Typography>
                        <Typography
                            color='text.primary'
                            variant='body1'
                            className='hover-link'
                            onClick={() => {
                                setValue("amount", delegationShare)
                            }}
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
                            disableElevation
                            className='button-capitalize-title'
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
                            {loading === 'pending' ? 'Loading...' : 'Undelegate'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

DialogUndelegate.propTypes = {
    onClose: PropTypes.func.isRequired,
    onUnDelegate: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    validator: PropTypes.object.isRequired,
    delegations: PropTypes.object.isRequired,
    currency: PropTypes.object.isRequired,
    loading: PropTypes.string.isRequired,
};
