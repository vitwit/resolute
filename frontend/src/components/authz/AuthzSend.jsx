import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { parseBalance } from '../../utils/denom';

export function AuthzSendDialog(props) {
    const { onClose, grant, currency, open, execTx, onExecSend } = props;
    const available = grant?.authorization.spend_limit ? parseBalance(grant.authorization.spend_limit, currency?.coinDecimals, currency?.coinMinimalDenom) : -1;
    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            amount: 0,
            recipient: '',
        }
    });

    const onSubmit = data => {
        onExecSend({
            from: grant?.granter,
            recipient: data.recipient,
            amount: Number(data.amount) * (10 ** currency.coinDecimals),
        })
    };

    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth='sm'
            fullWidth={true}
        >
            <DialogTitle
                style={{ textAlign: 'center' }}
                fontWeight={600}
                variant='h5'
                color='text.primary'
            >
                Send
            </DialogTitle>
            <DialogContent>
                <Box

                    noValidate
                    autoComplete="off"
                    sx={{
                        '& .MuiTextField-root': { m: 1 },
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <TextField
                                required
                                label="Sender"
                                fullWidth
                                value={grant?.granter}
                                disabled
                            />
                        </div>
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
                            onClick={() => available !== -1 ? setValue("amount", available) : null}
                        >
                            Availabel:&nbsp;{ available !== -1 ? `${available}${currency?.coinDenom}` : <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} /> } 
                        </Typography>
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ required: 'Amount is required',
                            validate: (value) => {
                                if (available === -1) {
                                    return Number(value) > 0
                                } else {
                                    return Number(value) > 0 && Number(value) <= Number(available)
                                }
                            }}}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    required
                                    label="Amount"
                                    fullWidth
                                    error={!!errors.amount}
                                        helperText={errors.amount?.type === 'validate' ? 'Invalid or Insufficient balance' : errors.amount?.message}
                                    
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment
                                                position="start"
                                            >
                                                {currency?.coinDenom}
                                            </InputAdornment>,
                                    }}
                                />}
                        />
                        <div
                            style={{ textAlign: 'center' }}
                        >
                            <br />
                            <Button
                                type='submit'
                                variant='outlined'
                                disableElevation
                                disabled={execTx === 'pending'}
                                size='medium'
                            >
                                {execTx === 'pending' ? <CircularProgress size={25} /> : 'Send'}
                            </Button>
                        </div>
                    </form>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

AuthzSendDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    grant: PropTypes.object.isRequired,
    currency: PropTypes.object.isRequired,
    execTx: PropTypes.string.isRequired,
    onExecSend: PropTypes.func.isRequired,
};