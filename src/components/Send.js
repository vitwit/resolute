import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

Send.propTypes = {
    onSend: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired,
    sendTx: PropTypes.object.isRequired,
    available: PropTypes.number.isRequired,
    authzTx: PropTypes.object.isRequired,
}

export default function Send(props) {
    const { chainInfo, sendTx, available, onSend, authzTx } = props;
    const currency = chainInfo.config.currencies[0];
    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            amount: 0,
            recipient: '',
        }
    });

    const onSubmit = data => {
        onSend({
            to: data.recipient,
            amount: Number(data.amount) * (10 ** currency.coinDecimals),
            denom: currency.coinMinimalDenom,
        })
    }

    return (

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
                    '& .MuiTextField-root': { mt: 1.5, mb: 1.5 },
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
                        <Button
                            type='submit'
                            variant='outlined'
                            disableElevation
                            disabled={sendTx.status === 'pending' || authzTx.status === 'pending'}
                            size='medium'
                        >
                            {sendTx.status === 'pending' || authzTx.status === 'pending' ? <CircularProgress size={25} /> : 'Send'}
                        </Button>
                    </div>
                </form>
            </Box>
        </Paper>
    );
}