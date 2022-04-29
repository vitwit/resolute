import { Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { authzMsgTypes } from '../utils/authorizations';
import Autocomplete from '@mui/material/Autocomplete';

export const WithdrawRewards = () => {
    const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
        defaultValues: {}
    });

    const onSubmit = data => {
        console.log(data);
    };

    return (

        <>
            <Grid container>
                <Grid item md={3} xs={1}></Grid>
                <Grid item md={6} xs={10}>
                    <Paper
                        elevation={0}
                        style={{ padding: 22 }}
                    >
                        <Typography
                            color='text.primary'
                            variant='h6'
                            fontWeight={600}
                        >
                            Withdraw Rewards
                        </Typography>
                        <br />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Typography
                                variant='color.secondary'
                                type='body1'
                                fontSize={14}
                                style={{ textDecoration: 'underline', justifyContent: 'right', display: 'flex' }}
                            >
                                Withdraw all 100.123
                            </Typography>
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
                                            label="Validator"
                                            // value={value}
                                            // onChange={onChange}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                        />} />
                                } />
                            <br />
                            <TextField
                                label="Memo (Optional)"
                                fullWidth
                            />

                            <br />
                            <br />

                            <Button
                                type='submit'
                                variant='outlined'
                                disableElevation
                                size='medium'
                            >Withdraw</Button>



                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item md={3} xs={1}></Grid>
        </>
    );
}