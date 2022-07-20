import React from 'react';
import { StyledTableCell, StyledTableRow } from './CustomTable';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { formatVotingPower } from '../utils/denom';
import { formatValidatorStatus } from '../utils/util';
import Button from '@mui/material/Button';

export function InActiveValidators(props) {
    const { validators, onMenuAction } = props;

    return (
        <>
            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table" size='small' >
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Rank</StyledTableCell>
                            <StyledTableCell align='left'>Validator</StyledTableCell>
                            <StyledTableCell align='center'>Voting Power</StyledTableCell>
                            <StyledTableCell align='center'>Commission</StyledTableCell>
                            <StyledTableCell align='center'>Status</StyledTableCell>
                            <StyledTableCell align='center'>Action</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(validators?.inactive).map((keyName, index) => (
                            <StyledTableRow
                                key={index + 1}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell component="th" scope="row"
                                >
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell
                                    align='left'
                                >
                                    {validators.inactive[keyName]?.description.moniker}
                                </StyledTableCell>
                                <StyledTableCell
                                    align='center'
                                >
                                    {formatVotingPower(validators.inactive[keyName]?.tokens)}
                                </StyledTableCell>
                                <StyledTableCell
                                    align='center'
                                >
                                    {(validators.inactive[keyName]?.commission.commission_rates.rate * 100).toFixed(2)}%
                                </StyledTableCell>
                                <StyledTableCell>
                                    {validators.inactive[keyName]?.jailed ? formatValidatorStatus(true, null) : formatValidatorStatus(false, validators.inactive[keyName]?.status)}
                                </StyledTableCell>
                                <StyledTableCell
                                    align='center'
                                >
                                    <Button
                                        variant="outlined"
                                        className='button-capitalize-title'
                                        size="small" onClick={(e) => onMenuAction(e, "delegate", validators.active[keyName])}
                                    >
                                        Delegate
                                    </Button>
                                    <Button
                                        style={{ marginLeft: 4 }}
                                        variant="outlined"
                                        className='button-capitalize-title'
                                        size="small" onClick={(e) => onMenuAction(e, "undelegate", validators.active[keyName])}
                                    >
                                        Undelegate
                                    </Button>
                                    <Button
                                        style={{ marginLeft: 4 }}
                                        variant="outlined"
                                        className='button-capitalize-title'
                                        size="small" onClick={(e) => onMenuAction(e, "redelegate", validators.active[keyName])}
                                    >
                                        Redelegate
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