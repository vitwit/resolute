import { Grid, Paper, Typography, Button } from '@mui/material';
import React from 'react';



export default function BalanceInfo() {


    return (
        <>
            <Paper elevation={0} spacing={2} style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant='h6'
                        color='text.primary'
                        gutterBottom
                        style={{ justifyContent: 'left', display: 'flex' }}
                    >
                        Account Info
                    </Typography>
                    <Button
                        color='primary'
                        variant='contained'
                        size='medium'
                        disableElevation
                    >
                        Transfer
                    </Button>
                </div>

                <Grid container>
                    <Grid item xs={12} md={5}>

                    </Grid>
                    <Grid item xs={12} md={7}>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                fontSize={16}
                                variant='body1'
                                gutterBottom
                                fontWeight={600}
                                color='text.primary'
                            >
                                Balance
                            </Typography>

                            <Typography
                                fontSize={16}
                                variant='body1'
                                fontWeight={600}
                                color='text.primary'
                            >
                                134,245,90
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                fontSize={16}
                                variant='body1'
                                fontWeight={600}
                                gutterBottom
                                color='text.primary'
                            >
                                Rewards
                            </Typography>
                            <Typography
                                fontSize={16}
                                variant='body1'
                                fontWeight={600}
                                color='text.primary'
                            >
                                456,789,00
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography
                                fontSize={16}
                                gutterBottom
                                variant='body1'
                                fontWeight={600}
                                color='text.primary'
                            >
                                Unbonding
                            </Typography>

                            <Typography
                                fontSize={16}
                                variant='body1'
                                fontWeight={600}
                                color='text.primary'
                            >
                                123,567,789
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <Typography
                                fontSize={16}
                                variant='body1'
                                gutterBottom
                                fontWeight={600}
                                color='text.primary'
                            >
                                Rewards
                            </Typography>

                            <Typography
                                fontSize={16}
                                variant='body1'
                                fontWeight={600}
                                gutterBottom={true}
                                color='text.primary'
                            >
                                123,45
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}