import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StyledTableCell, StyledTableRow } from './../pages/table';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { formatVotingPower } from '../utils/denom';

export function ActiveValidators(props) {
    const { validators, onActiveAction } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event, validator) => {
      setAnchorEl(event.currentTarget);
      onActiveAction(event.currentTarget, validator);
      setAnchorEl(null);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

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
                                        size="small" onClick={(e) => handleClick(e, validators.active[keyName])}
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

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Delegate</MenuItem>
                <MenuItem onClick={handleClose}>Undelegate</MenuItem>
                <MenuItem onClick={handleClose}>WithdrawRewards</MenuItem>
            </Menu>
        </>
    );
}