import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';
import { Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import { authzMsgTypes } from '../utils/authorizations';
import { useForm, Controller } from "react-hook-form";


export default function NewAuthz() {
    // const address = useSelector((state) => state.wallet.bech32Address);
    // const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('send')
    let date = new Date()
    let expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));



    const { register, handleSubmit, watch, control, formState: { errors }, setValue } = useForm({
        defaultValues: {
            grantee: '',
            spendLimit: 0,
            expiration: expiration,
        }
    });

    const onSubmit = data => {
        console.log(data);
    };

    const onChange = (type) => {
        setSelected(type);
    }

    const onDateChange = (value) => {
        setValue('expiration', value)
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
                                <form onSubmit={handleSubmit(onSubmit)}>
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
                                        rules={{ required: 'Spend limit is required' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                                            <TextField
                                                label="Spend Limit"
                                                value={value}
                                                onChange={onChange}
                                                type='number'
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                fullWidth
                                            />}
                                    />
                                    <br />
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
                                        type='submit'
                                        style={{ marginTop: 32 }}
                                        variant="outlined"
                                    >
                                        Grant
                                    </Button>
                                </form>
                                :
                                ''
                        }

                        {
                            selected === 'generic' ?
                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                            name="typeURL"
                                            control={control}
                                            rules={{ required: 'Message type is required' }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) =>

                                                <Autocomplete
                                                    disablePortal
                                                    fullWidth
                                                    variant="outlined"
                                                    options={authzMsgTypes()}
                                                    renderInput={(params) => <TextField {...params} 
                                                    label="Type"
                                                    // value={value}
                                                    // onChange={onChange}
                                                    error={!!error}
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
                                        type='submit'
                                            style={{ marginTop: 32 }}
                                            variant="outlined"
                                        >
                                            Grant
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
