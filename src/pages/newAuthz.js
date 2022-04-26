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


export default function NewAuthz() {
    // const address = useSelector((state) => state.wallet.bech32Address);
    // const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('send')
    const [expiration, setExpiration] = React.useState(new Date());

    const onChange = (type) => {
        setSelected(type);
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
                            selected === 'generic' ?
                                <>
                                    <Autocomplete
                                        disablePortal
                                        fullWidth
                                        variant="outlined"
                                        options={authzMsgTypes()}
                                        renderInput={(params) => <TextField {...params} label="Type URL" />} />
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

                    </Paper>
                </Grid>
                <Grid item md={3} sm={2}></Grid>
            </Grid>
        </>

    );
}
