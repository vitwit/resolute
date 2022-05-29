import React from 'react';
import Button from '@mui/material/Button';
import { StyledTableCell, StyledTableRow } from './CustomTable';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { formatVotingPower } from '../utils/denom';

export function ActiveValidators(props) {
    const { validators, onMenuAction } = props;

    return (
        <>
            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Rank</StyledTableCell>
                            <StyledTableCell>Validator</StyledTableCell>
                            <StyledTableCell>Voting Power</StyledTableCell>
                            <StyledTableCell>Comission</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
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
                                <StyledTableCell>
                                    {validators.active[keyName]?.description.moniker}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {formatVotingPower(validators.active[keyName].tokens)}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {(validators.active[keyName].commission.commission_rates.rate * 100).toFixed(2)}%
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Button
                                        variant="outlined"
                                        size="small" onClick={(e) => onMenuAction(e, validators.active[keyName])}
                                    >
                                        Actions
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