import React from 'react';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

export default function BalanceInfo(props) {
    const currency = props.currencies[0];
    let navigate = useNavigate();
    function navigateTo(path) {
        navigate(path);
    }

    return (
        <>
            <br /><br /><br />
            <CssBaseline />
            <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                            variant='body1'
                            gutterBottom
                            fontWeight={500}
                            color='text.secondary'
                        >
                            Total Balance
                        </Typography>
                        <Paper elevation={0} style={{ padding: 12 }}>
                            <Typography
                                variant='body1'
                                fontWeight={500}
                                gutterBottom
                                color='text.primary'
                            >
                                {(parseFloat(props.balance) + parseFloat(props.delegations) +
                                    parseFloat(props.rewards) + parseFloat(props.unbonding)).toFixed(5).toLocaleString()}
                                &nbsp;{currency.coinDenom}
                            </Typography>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Balance
                        balance={props.balance}
                        title="Available"
                        displayDenom={currency.coinDenom}
                    />
                    <Button
                        style={{ marginTop: 8 }}
                        variant='outlined'
                        disableElevation
                        fullWidth
                        className='button-capitalize-title'
                        onClick={() => navigateTo("/send")}
                    >
                        Send
                    </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Balance
                        balance={props.rewards}
                        title="Rewards"
                        displayDenom={currency.coinDenom}
                    />
                    <Button
                        style={{ marginTop: 8 }}
                        variant='outlined'
                        disableElevation
                        fullWidth
                        className='button-capitalize-title'
                        onClick={() => navigateTo("/staking")}
                    >
                        Claim
                    </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Balance
                        balance={props.delegations}
                        title="Staked"
                        displayDenom={currency.coinDenom}
                    />
                    <Button
                        style={{ marginTop: 8 }}
                        variant='outlined'
                        disableElevation
                        fullWidth
                        className='button-capitalize-title'
                        onClick={() => navigateTo("/staking")}
                    >
                        Delegate
                    </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Balance
                        balance={props.unbonding}
                        title="Unbonding"
                        displayDenom={currency.coinDenom}
                    />
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
    currencies: PropTypes.array.isRequired,
};

function Balance(props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
                variant='body1'
                color='text.secondary'
                fontWeight={500}
                gutterBottom
            >
                {props.title}
            </Typography>
            <Paper elevation={0} spacing={4} style={{ padding: 12 }}>
                <Typography
                    variant='body1'
                    fontWeight={500}
                    color='text.primary'
                    gutterBottom
                >
                    {props.balance}&nbsp;{props.displayDenom}
                </Typography>
            </Paper>
        </div>
    );
}

Balance.propTypes = {
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    displayDenom: PropTypes.string.isRequired,
};