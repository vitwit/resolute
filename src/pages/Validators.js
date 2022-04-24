import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getValidators,
} from './../features/stake/stakeSlice';
import {

} from './../features/wallet/walletSlice';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatVotingPower } from '../utils/denom';

export function Validators() {
    const validators = useSelector((state) => state.staking.validators);
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const dispatch = useDispatch();

    const [selected, setSelected] = React.useState('active')

    useEffect(() => {
        dispatch(getValidators({
            baseURL: chainInfo.lcd,
            key: null,
            limit: 10,
            status: `BOND_STATUS_BONDED`
        }))
    }, [chainInfo]);

    return (
        <>

            <ButtonGroup variant="outlined" aria-label="validators">
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
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>RANK</TableCell>
                                        <TableCell>NAME</TableCell>
                                        <TableCell>VOTING POWER</TableCell>
                                        <TableCell>COMMISSION</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {validators.validators.map((row) => (
                                        <TableRow
                                            key={row.index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                1
                                            </TableCell>
                                            <TableCell>{row.description.moniker}</TableCell>
                                            <TableCell>{formatVotingPower(row.tokens)}</TableCell>
                                            <TableCell>{row.commission.commission_rates.rate * 100}%</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" startIcon={<DeleteIcon />} size="small">
                                                    Revoke
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>

                    :

                    <>
                        <Typography>Inactive</Typography>
                    </>

            }

        </>


        // <div>
        //   <div>
        //     <button
        //       aria-label="Decrement value"
        //       onClick={() => dispatch(getValidators({
        //           baseURL: "https://cosmos.api.ping.pub/",
        //           key: null,limit:10}))}
        //     >
        //       -
        //     </button>
        //     <br/>
        //     data {JSON.stringify(validators)}
        //     <br/>
        //         Loading: {loading}
        //     <br/>
        //         errMsg:  {errMsg}
        //   </div>
        // </div>
    );
}
