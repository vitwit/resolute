import React from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export default function BalanceInfo(props) {
    let navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }

    return (
        <>
            <Paper elevation={0} spacing={2} style={{ padding: 24 }}>
                <div style={{ textAlign: 'right' }}>
                    <Button
                        variant='contained'
                        size='small'
                        disableElevation
                        onClick={() => navigateTo("/send")}
                        disabled={props.balance <= 0.0001}
                    >
                        Send
                    </Button>
                </div>
                <br />
                <CssBaseline />
                <Grid container>
                    <Grid item xs={12} md={3}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                variant='h6'
                                gutterBottom
                                style={{ textAlign: 'left' }}
                                color='text.secondary'
                            >
                                Total Balance
                            </Typography>
                            <Typography
                                variant='h5'
                                fontWeight={500}
                                style={{ textAlign: 'left' }}
                                color='text.primary'
                            >
                                {(parseFloat(props.balance) + parseFloat(props.delegations) + parseFloat(props.rewards) + parseFloat(props.unbonding)).toFixed(5).toLocaleString()}
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={9}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }
                        }
                    >
                        <Balance
                            balance={props.balance}
                            title="Available"
                        />

                        <Balance
                            balance={props.rewards}
                            title="Rewards"
                        />
                        <Balance
                            balance={props.delegations}
                            title="Delegated"
                        />
                        <Balance
                            balance={props.unbonding}
                            title="Unbonding"
                        />

                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}

BalanceInfo.propTypes = {
    chainInfo: PropTypes.object.isRequired,
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    delegations: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    rewards: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    unbonding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};




function Balance(props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
                variant='h6'
                color='text.secondary'
                gutterBottom
                style={{ textAlign: 'left' }}
            >
                {props.title}
            </Typography>
            <Typography
                variant='h6'
                fontWeight={500}
                color='text.primary'
                gutterBottom
                style={{ textAlign: 'left' }}
            >
                {props.balance}
            </Typography>

        </div>
    );
}

Balance.propTypes = {
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
};