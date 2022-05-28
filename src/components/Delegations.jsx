import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { StyledTableCell, StyledTableRow } from './../pages/table';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { formatValidatorStatus } from '../utils/util';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

export function MyDelegations(props) {
    const { delegations, validators, onDelegationAction, currency, rewards } = props;
    const [totalStaked, setTotalStaked] = React.useState(0);
    const [totalRewards, setTotalRewards] = React.useState(0);
    const distTxStatus = useSelector((state) => state.distribution.tx);
    const [rewardsP, setRewardsP] = React.useState({});

    useEffect(() => {
        let total = 0.0
        if (delegations?.delegations.length > 0) {
            for (let i = 0; i < delegations.delegations.length; i++)
                total += parseFloat(delegations.delegations[i].delegation.shares) / (10 ** currency?.coinDecimals)
        }
        setTotalStaked(total?.toFixed(4));

    }, [delegations]);

    useEffect(() => {
        let total = 0.0
        if (rewards.length > 0) {
            for (let i = 0; i < rewards.length; i++)
                if (rewards[i].reward.length > 0) {
                    const reward = rewards[i]?.reward[0]
                    let temp = rewardsP
                    temp[rewards[i].validator_address] = (parseFloat(reward.amount) / (10 ** currency?.coinDecimals))
                    setRewardsP(temp)
                    total += parseFloat(reward.amount) / (10 ** currency?.coinDecimals)
                } else {
                    let temp = rewardsP
                    temp[rewards[i].validator_address] = 0.0
                    setRewardsP(temp)
                }
        }

        setTotalRewards(total.toFixed(5));
    }, [rewards]);

    const handleClick = (event, delegation) => {
        let val = {}
        if (delegation.validator_address in validators?.active) {
            val = validators?.active[delegation.validator_address]
        } else {
            val = validators?.inactive[delegation.validator_address]
        }
        onDelegationAction(event, val);
    };

    return (
        <>
            <Paper elevation={0} style={{ padding: 12 }}>
                <div className='inline-space-between' style={{ marginBottom: 12 }}>
                    <Typography>
                        Total staked: {totalStaked} {currency?.coinDenom}
                    </Typography>

                    <Button
                        variant='contained'
                        size='small'
                        style={{ textTransform: 'none' }}
                        onClick={() => props.onWithdrawAllRewards()}
                        disabled={distTxStatus?.status === 'pending'}
                    >
                        {distTxStatus?.status === 'pending' ? <CircularProgress size={25}/> : `Claim Rewards: ${totalRewards} ${currency?.coinDenom}`}
                    </Button>
                </div>
                <TableContainer component={Paper} elevation={0}>
                    {
                        delegations?.status === 'pending' ?
                            delegations?.delegations.length === 0 ?
                                <CircularProgress />
                                :
                                <>
                                </>
                            :
                            delegations?.delegations.length === 0 ?
                                <Typography
                                    variant='h6'
                                    color='text.primary'
                                    style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                                    No Deligations Found
                                </Typography>
                                :
                                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell>Rank</StyledTableCell>
                                            <StyledTableCell>Validator</StyledTableCell>
                                            <StyledTableCell>Comission</StyledTableCell>
                                            <StyledTableCell>Delegated</StyledTableCell>
                                            <StyledTableCell>Rewards</StyledTableCell>
                                            <StyledTableCell>Status</StyledTableCell>
                                            <StyledTableCell>Action</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            delegations?.delegations.map((row, index) => (
                                                <StyledTableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <StyledTableCell component="th" scope="row">
                                                        {index + 1}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {validators?.active[row.delegation.validator_address]?.description.moniker}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {(validators?.active[row.delegation.validator_address]?.commission.commission_rates.rate * 100).toFixed(2)}%
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {parseFloat(row.delegation.shares) / (10 ** currency?.coinDecimals)}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {rewardsP[row.delegation.validator_address]?.toFixed(6)}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        {validators.active[row.delegation.validator_address]?.jailed ? formatValidatorStatus(true, null) : formatValidatorStatus(false, validators.active[row.delegation.validator_address]?.status)}
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={(e) => handleClick(e, row.delegation)}
                                                        >
                                                            Actions
                                                        </Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                    }
                </TableContainer>
            </Paper>
        </>
    );
}