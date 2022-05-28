import React from 'react';
import { StyledTableCell, StyledTableRow } from './../pages/table';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { formatVotingPower } from '../utils/denom';
import { formatValidatorStatus } from '../utils/util';
import Button from '@mui/material/Button';

export function InActiveValidators(props) {
    const {validators, onMenuAction} = props;

    return (
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
                                <StyledTableCell>
                                    {validators.inactive[keyName]?.description.moniker}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {formatVotingPower(validators.inactive[keyName]?.tokens)}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {(validators.inactive[keyName]?.commission.commission_rates.rate * 100).toFixed(2)}%
                                </StyledTableCell>
                                <StyledTableCell>
                                    {validators.inactive[keyName]?.jailed ? formatValidatorStatus(true, null) : formatValidatorStatus(false, validators.inactive[keyName]?.status)}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Button
                                    variant='outlined'
                                    size='small'
                                    onClick={(e) => {onMenuAction(e, validators.inactive)}}
                                    >
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
    );
}