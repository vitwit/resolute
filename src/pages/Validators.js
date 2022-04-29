import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getValidators, resetState, getDelegations, sortValidatorsByVotingPower
} from '../features/staking/stakeSlice';
import {

} from './../features/wallet/walletSlice';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { formatVotingPower } from '../utils/denom';
import { StyledTableCell, StyledTableRow } from './table';
import { Typography } from '@mui/material';
import { formatValidatorStatus } from '../utils/util';

export function Validators() {
    const [type, setType] = useState('delegations');

    const validators = useSelector((state) => state.staking.validators);
    const pagination = useSelector((state) => state.staking.validators.pagination);
    const delegations = useSelector((state) => state.staking.delegations);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const address = useSelector((state) => state.wallet.address);
    const walletConnected = useSelector((state) => state.wallet.connected);
    const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('active')

    useEffect(() => {
        dispatch(resetState())
        if (walletConnected) {
            dispatch(getValidators({
                baseURL: chainInfo.lcd,
            }))
        }
    }, [chainInfo]);

    useEffect(() => {
        if (walletConnected) {
            dispatch(getDelegations({
                baseURL: chainInfo.lcd,
                address: address,
            }))
        }
    }, [walletConnected]);

    useEffect(() => {
        if (walletConnected) {
            if (pagination?.next_key !== undefined || pagination?.next_key !== null) {
                dispatch(getValidators({
                    baseURL: chainInfo.lcd,
                    key: pagination.next_key
                }))
            } else {
                console.log(pagination)
                if(Object.keys(validators?.active).length > 0 && pagination?.next_key === null)
                    dispatch(sortValidatorsByVotingPower())
            }
            }
    }, [pagination])

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="outlined button staking">
                <Button
                    variant={type === 'delegations' ? 'contained' : 'outlined'}
                    onClick={() => setType('delegations')}
                >My Delegations</Button>
                <Button
                    variant={type === 'validators' ? 'contained' : 'outlined'}
                    onClick={() => setType('validators')}
                >Validators</Button>
            </ButtonGroup>
            {
                type === 'delegations' ? (
                    <Paper elevation={0} style={{ padding: 12 }}>
                        <TableContainer component={Paper} elevation={0}>
                            {
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
                                                <StyledTableCell>Status</StyledTableCell>
                                                <StyledTableCell>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                delegations?.delegations.map((row, index) => (
                                                    <StyledTableRow
                                                        key={row.index + 1}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <StyledTableCell component="th" scope="row">
                                                            {index + 1}
                                                        </StyledTableCell>
                                                        <StyledTableCell> {validators?.active[row.delegation.validator_address]?.description.moniker} </StyledTableCell>
                                                        <StyledTableCell> {(validators?.active[row.delegation.validator_address]?.commission.commission_rates.rate * 100).toFixed(2)}% </StyledTableCell>
                                                        <StyledTableCell>{parseFloat(row.delegation.shares) / 1000000}</StyledTableCell>
                                                        <StyledTableCell> {validators.active[row.delegation.validator_address]?.jailed ? formatValidatorStatus(true, null) : formatValidatorStatus(false, validators.active[row.delegation.validator_address]?.status)} </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Button variant="outlined" size="small">
                                                                Unbond
                                                            </Button>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                            <Button variant="outlined" size="small">
                                                                Redelegate
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
                )
                    :
                    (
                        <Paper elevation={0} style={{ padding: 12 }}>
                            <ButtonGroup variant="outlined" aria-label="validators" style={{ display: 'flex', marginBottom: 12 }}>
                                <Button
                                    variant={selected === 'active' ? 'contained' : 'outlined'}
                                    onClick={() => setSelected('active')}
                                >Active</Button>
                                <Button
                                    variant={selected === 'inactive' ? 'contained' : 'outlined'}
                                    onClick={() => setSelected('inactive')}
                                >Inactive</Button>
                            </ButtonGroup>
                            {
                                selected === 'active' ?
                                    <>
                                        <TableContainer component={Paper} elevation={0}>
                                            <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <StyledTableCell>Rak</StyledTableCell>
                                                        <StyledTableCell>Validator</StyledTableCell>
                                                        <StyledTableCell>Voting Power</StyledTableCell>
                                                        <StyledTableCell>Comission</StyledTableCell>
                                                        <StyledTableCell>Action</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.keys(validators?.active).map((keyName, index) => (
                                                        <StyledTableRow
                                                            key={index + 1}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <StyledTableCell component="th" scope="row">
                                                                {index + 1}
                                                            </StyledTableCell>
                                                            <StyledTableCell>{validators.active[keyName]?.description.moniker}</StyledTableCell>
                                                            <StyledTableCell>{formatVotingPower(validators.active[keyName].tokens)}</StyledTableCell>
                                                            <StyledTableCell>{(validators.active[keyName].commission.commission_rates.rate * 100).toFixed(2)}%</StyledTableCell>
                                                            <StyledTableCell>
                                                                <Button variant="outlined" size="small" onClick={() => { alert("not implemented") }}>
                                                                    Delegate
                                                                </Button>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </>

                                    :

                                    <>
                                        <TableContainer component={Paper} elevation={0}>
                                            <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                                <TableHead>
                                                    <StyledTableRow>
                                                        <StyledTableCell>Rank</StyledTableCell>
                                                        <StyledTableCell>Validator</StyledTableCell>
                                                        <StyledTableCell>Voting Power</StyledTableCell>
                                                        <StyledTableCell>Commission</StyledTableCell>
                                                        <StyledTableCell>Status</StyledTableCell>
                                                        <StyledTableCell>Action</StyledTableCell>
                                                    </StyledTableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.keys(validators?.inactive).map((keyName, index) => (
                                                        <StyledTableRow
                                                            key={index + 1}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <StyledTableCell component="th" scope="row">
                                                                {index + 1}
                                                            </StyledTableCell>
                                                            <StyledTableCell>{validators.inactive[keyName]?.description.moniker}</StyledTableCell>
                                                            <StyledTableCell>{formatVotingPower(validators.inactive[keyName]?.tokens)}</StyledTableCell>
                                                            <StyledTableCell>{(validators.inactive[keyName]?.commission.commission_rates.rate * 100).toFixed(2)}%</StyledTableCell>
                                                            <StyledTableCell>{validators.inactive[keyName]?.jailed ? formatValidatorStatus(true, null) : formatValidatorStatus(false, validators.inactive[keyName]?.status)}</StyledTableCell>
                                                            <StyledTableCell>
                                                                -
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </>
                            }
                        </Paper>
                    )
            }
        </>
    );
}
