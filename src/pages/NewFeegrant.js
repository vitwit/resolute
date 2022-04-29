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


export default function NewFeegrant() {
    // const address = useSelector((state) => state.wallet.bech32Address);
    // const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('basic')
    const [expiration, setExpiration] = React.useState(new Date());

    const onChange = (type) => {
        setSelected(type);
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
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Grantee" />
                                    <br />
                                    <br/>
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
                                                setExpiration(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <br />

                                    <Button
                                        style={{ marginTop: 32 }}
                                        variant="outlined"
                                    >
                                        Grant
                                    </Button>
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
                                                setExpiration(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <br />

                                    <Button
                                        style={{ marginTop: 32 }}
                                        variant="outlined"
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
