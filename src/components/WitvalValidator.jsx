import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { StyledTableCell, StyledTableRow } from './CustomTable';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { formatVotingPower } from '../utils/denom';
import Typography from '@mui/material/Typography';

export function WitvalValidator(props) {
    const { validators, onMenuAction } = props;
    const [validator, setValidator] = useState({});

    const getWitvalValidator = () => {
        const keys = Object.keys(validators?.active)
        for (let i = 0; i < keys.length; i++) {
            if (validators.active[keys[i]]?.description?.moniker === "Witval") {
                setValidator(validators.active[keys[i]])
                break
            }
        }
    }

    useEffect(() => {
        getWitvalValidator();
    }, [validators])

    return (
        <>
            {
                validator?.description?.moniker === "Witval" ?
                <Paper elevation={0} style={{padding: 12}}>
                    <Typography
                        style={{padding: 12, textAlign: 'left'}}
                        color='text.primary'
                        fontWeight={600}
                        variant='h6'
                    >
                        Help Witval By Staking
                    </Typography>
                    <TableContainer component={Paper} elevation={0}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Validator</StyledTableCell>
                                    <StyledTableCell>Voting Power</StyledTableCell>
                                    <StyledTableCell>Comission</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>

                                <StyledTableRow
                                    key={1}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <StyledTableCell>
                                        {validator?.description.moniker}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {formatVotingPower(validator.tokens)}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {(validator.commission.commission_rates.rate * 100).toFixed(2)}%
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Button
                                            variant="outlined"
                                            size="small" onClick={(e) => onMenuAction(e, validator)}
                                        >
                                            Actions
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                    </Paper>
                    :
                    <></>
            }
        </>
    );
}