import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { parseSpendLimit } from '../utils/denom';

AuthzSend.propTypes = {
    onAuthzSend: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired,
    authzTx: PropTypes.object.isRequired,
    grants: PropTypes.array.isRequired,
}

export default function AuthzSend(props) {
    const { chainInfo, authzTx, grants, onAuthzSend } = props;

    const [selected, setSelected] = useState({})
    const currency = chainInfo.config.currencies[0];
    const { handleSubmit, control } = useForm({
        defaultValues: {
            amount: 0,
            recipient: '',
        }
    });

    const onSubmit = data => {
        onAuthzSend({
            to: data.recipient,
            granter: selected?.granter,
            amount: Number(data.amount) * (10 ** currency.coinDecimals),
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
                Authz Send
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
                    <FormControl
                        required
                        component="fieldset"
                        variant="outlined"
                        fullWidth
                        style={{ textAlign: 'left' }}
                    >
                        <InputLabel id="demo-simple-select-label">Granter</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selected?.granter}
                            label="Granter"
                            onChange={() => { }}
                        >
                            {
                                grants.map((item, index) =>
                                (
                                    <MenuItem
                                        key={index}
                                        id={index}
                                        value={item.granter}
                                        onClick={() => {
                                            setSelected(item)
                                        }
                                        }
                                    >
                                        {item.granter}
                                    </MenuItem>
                                )
                                )
                            }
                        </Select>

                    </FormControl>
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
                    >
                        Spend Limit:&nbsp;{selected.authorization && selected?.authorization["@type"] === "/cosmos.bank.v1beta1.SendAuthorization" ?
                            parseSpendLimit(selected?.authorization?.spend_limit) :
                            <span dangerouslySetInnerHTML={{ "__html": "&infin;" }} />
                        } {currency?.coinDenom}
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
                            disabled={authzTx.status === 'pending'}
                            size='medium'
                        >
                            {authzTx.status === 'pending' ? <CircularProgress size={25} /> : 'Send'}
                        </Button>
                    </div>
                </form>
            </Box>
        </Paper>
    );
}