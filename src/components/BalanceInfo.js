import React from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export default function BalanceInfo(props) {
    let navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }

    return (
        <>
            <br/><br/><br/>
            <CssBaseline />
            <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                    <Paper elevation={0} style={{ padding: 24 }}>
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
                                gutterBottom
                                style={{ textAlign: 'left' }}
                                color='text.primary'
                            >
                                {(parseFloat(props.balance) + parseFloat(props.delegations) + parseFloat(props.rewards) + parseFloat(props.unbonding)).toFixed(5).toLocaleString()}
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Paper elevation={0} spacing={4} style={{ padding: 24 }}>
                        <Balance
                            balance={props.balance}
                            title="Available"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Paper elevation={0} spacing={2} style={{ padding: 24 }}>
                        <Balance
                            balance={props.rewards}
                            title="Rewards"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Paper elevation={0} spacing={2} style={{ padding: 24 }}>
                        <Balance
                            balance={props.delegations}
                            title="Delegated"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Paper elevation={0} spacing={2} style={{ padding: 24 }}>
                        <Balance
                            balance={props.unbonding}
                            title="Unbonding"
                        />
                    </Paper>
                </Grid>
            </Grid>
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