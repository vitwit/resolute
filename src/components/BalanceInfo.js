import { Grid, Paper, Typography, Button, CssBaseline } from '@mui/material';
import React from 'react';
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
                <div style={{textAlign: 'right'}}>
                <Button variant='contained' size ='small' disableElevation onClick={() => navigateTo("/send")}>Send</Button>&nbsp;&nbsp;&nbsp;
                <Button variant='contained' size ='small' disableElevation onClick={() => navigateTo("/withdraw-rewards")}>Withdraw Rewards</Button>
                </div>
                <br/>
                <CssBaseline />
                <Grid container>
                    <Grid item xs={12} md={3}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                variant='h6'
                                fontWeight={500}
                                gutterBottom
                                style={{ textAlign: 'left' }}
                                color='text.secondary'
                            >
                                Total Balance
                            </Typography>
                            <Typography
                                variant='h6'
                                fontWeight={600}
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
                            padding: 12,
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
    balance: PropTypes.number.isRequired,
    delegations: PropTypes.number.isRequired,
    rewards: PropTypes.number.isRequired,
    unbonding: PropTypes.number.isRequired,
};




function Balance(props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
                variant='body2'
                fontWeight={500}
                color='text.secondary'
                gutterBottom
                style={{ textAlign: 'left' }}
            >
                {props.title}
            </Typography>
            <Typography
                variant='subtitle1'
                fontWeight={600}
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
    balance: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};