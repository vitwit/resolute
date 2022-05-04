import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import { txFeegrantBasic } from '../features/feegrant/feegrantSlice';
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';


export default function NewFeegrant() {
    const address = useSelector((state) => state.wallet.address);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('basic')

    let date = new Date()
    let expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);


    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            grantee: '',
            spendLimit: 0,
            expiration: expiration,
        }
    });

    const onChange = (type) => {
        setSelected(type);
    }

    const onBasicSubmit = (data) => {
        dispatch(txFeegrantBasic({
            granter: address,
            grantee: data.grantee,
            spendLimit: data.spendLimit,
            expiration: data.expiration,
            denom: currency.coinMinimalDenom,
            memo: data.memo ? data.memo : "",
            chainId: chainInfo.chainId,
            rpc: chainInfo.rpc,
            feeAmount: 25000,
        }))
    }

    const onDateChange = (value) => {
        setValue('expiration', value)
    }

    return (
        <>
            <br />
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button
                    variant={selected === 'basic' ? 'contained' : 'outlined'}
                    onClick={() => onChange('basic')}
                >
                    Basic
                </Button>
                <Button
                    variant={selected === 'periodic' ? 'contained' : 'outlined'}
                    onClick={() => onChange('periodic')}
                >
                    Periodic
                </Button>
                <Button
                    variant={selected === 'filtered' ? 'contained' : 'outlined'}
                    onClick={() => onChange('filtered')}
                >
                    Filtered
                </Button>
            </ButtonGroup>
            <Grid container spacing={2}>
                <br />
                <Grid item md={3} sm={2}></Grid>
                <Grid item md={6} sm={8}>
                    <Paper elevation={0} style={{ padding: 32 }}>

                        {
                            selected === 'basic' ?
                                <>
                                <form onSubmit={handleSubmit(onBasicSubmit)}>
                                    <Controller
                                        name="grantee"
                                        control={control}
                                        rules={{ required: 'Grantee is required' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
                                                label="Grantee"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                fullWidth
                                            />}
                                    />
                                    <br />
                                    <br />

                                    <Controller
                                        name="spendLimit"
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
                                                label="Spend Limit"
                                                value={value}
                                                onChange={onChange}
                                                inputMode='decimal'
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                fullWidth
                                            />}
                                    />
                                    <br />
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
                                                    onChange={onDateChange}
                                                    helperText={error ? error.message : null}
                                                />
                                            </LocalizationProvider>
                                        }
                                    />
                                    <br />

                                    <Button
                                        style={{ marginTop: 32 }}
                                        variant="outlined"
                                        type='submit'
                                    >
                                        Grant
                                    </Button>
                                    </form>
                                </>
                                :
                                ''
                        }

                        {
                            selected === 'periodic' ?
                                <>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Spend limit" inputMode='decimal' />
                                    <br />
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField style={{ marginTop: 32 }} fullWidth {...props} />}
                                            label="Expiration"
                                            value={expiration}
                                            onChange={(newValue) => {
                                                // setExpiration(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <br />

                                    <Button
                                        style={{ marginTop: 32 }}
                                        variant="outlined"
                                        onClick={onBasicSubmit}
                                    >
                                        Grant
                                    </Button>
                                </>
                                :
                                ''
                        }

                        {
                            selected === 'filtered' ?
                                <h1>Filtered</h1>
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
