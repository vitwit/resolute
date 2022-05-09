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
import { formatValidatorStatus } from '../utils/util';
import Typography from '@mui/material/Typography';

export function MyDelegations(props) {
    const { delegations, validators, onDelegationAction } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event, validator) => {
      setAnchorEl(event.currentTarget);
      onDelegationAction(event.currentTarget, validator);
      setAnchorEl(null);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <>
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
                                                <StyledTableCell>
                                                    {validators?.active[row.delegation.validator_address]?.description.moniker}
                                                    </StyledTableCell>
                                                <StyledTableCell>
                                                    {(validators?.active[row.delegation.validator_address]?.commission.commission_rates.rate * 100).toFixed(2)}% 
                                                    </StyledTableCell>
                                                <StyledTableCell>
                                                    {parseFloat(row.delegation.shares) / 1000000}
                                                    </StyledTableCell>
                                                <StyledTableCell>
                                                    {validators.active[row.delegation.validator_address]?.jailed ? formatValidatorStatus(true, null) : formatValidatorStatus(false, validators.active[row.delegation.validator_address]?.status)}
                                                    </StyledTableCell>
                                                <StyledTableCell>
                                                    <Button
                                                    variant="outlined"
                                                     size="small"
                                                     onClick={(e) => handleClick(row.delegation)}
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
                <MenuItem onClick={handleClose}>ReDelegate</MenuItem>
            </Menu>
        </>
    );
}