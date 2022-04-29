import { Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export const Send = () => {

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
                style={{padding: 22}}
            >
                <Typography
                color='text.primary'
                variant='h6'
                fontWeight={600}
                >
                    Send
                </Typography>
                <br/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="recipient"
                        control={control}
                        rules={{ required: 'Recipient is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                            <TextField
                                label="Recipient"
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
                        name="amount"
                        control={control}
                        rules={{ required: 'Amount is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) =>
                            <TextField
                                label="Amount"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                fullWidth
                            />}
                    />
                    <br />
                    <br />
                    <TextField
                                label="Memo (Optional)"
                                fullWidth
                            />

                            <br/>
                            <br/>

                    <Button
                        type='submit'
                        variant='outlined'
                        disableElevation
                        size='medium'
                    >Send</Button>



                </form>
                </Paper>
                </Grid>
                </Grid>
                <Grid item md={3} xs={1}></Grid>
        </>
    );
}