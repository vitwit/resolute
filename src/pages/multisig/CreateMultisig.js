import { Box, Button, CircularProgress, FormControl, Icon, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InfoIcon from '@mui/icons-material/Info';
import { DialogCreateMultisig } from '../../components/DialogCreateMultisig';
import { getMultisigAccounts } from '../../features/multisig/multisigSlice';

export default function CreateMultisig({ handleNext }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showFormAddress, setShowFormAddress] = useState(false);
    const dispatch = useDispatch();
    const createMultiAccRes = useSelector((state) => state.multisig.createMultisigAccountRes);

    const wallet = useSelector((state) => state.wallet);

    const balance = useSelector((state) => state.bank.balance);
    const { chainInfo, address, connected } = wallet;

    const multisigAccounts = useSelector(state => state.multisig.multisigAccounts)
    const accounts = multisigAccounts.data && multisigAccounts.data.data || []
    const walletAddress = useSelector((state) => state.wallet.address);

    const { config } = chainInfo;
    const { chainId } = config;
    const addressPrefix = config?.bech32Config?.bech32PrefixAccAddr;

    useEffect(() => {
        if (createMultiAccRes.status === 'done') {
            setOpen(false);
            dispatch(getMultisigAccounts(walletAddress))
        }
    }, [createMultiAccRes])

    useEffect(() => {
        if (connected) {
            dispatch(getMultisigAccounts(walletAddress))
        }
    }, [chainInfo]);

    const onClose = () => {
        setOpen(false);
    }

    return (
        <Grid container>
            <Grid item xs={1} md={1}></Grid>
            <Grid item xs={10} md={10}>
                <Paper elevation={0} style={{ padding: 22 }}>
                    <Typography
                        variant='h6'
                        fontWeight={600}
                        color='text.primary'
                        gutterBottom
                    >
                        Create / Select Multisig Account
                    </Typography>
                    <Button
                        onClick={() => {
                            setOpen(!open)
                            // setShowFormAddress(!showFormAddress)
                        }}
                        style={{ float: 'right' }} className='pull-right'>
                        + Create Address
                    </Button>
                    <br /><br />
                    <Box>
                        {
                            multisigAccounts?.status !== 'pending' && !accounts?.length ?
                                <span> <strong style={{
                                    color: '#8c3030'
                                }}> <InfoIcon style={{ top: 2 }}></InfoIcon>  No MultisigAccounts found on your address</strong>
                                </span> :
                                null

                        }
                        {
                            multisigAccounts?.status === 'pending' ?
                                <CircularProgress size={40} /> : null
                        }
                    </Box>

                    {
                        accounts?.length && !showFormAddress ?
                            <FormControl fullWidth>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Address</TableCell>
                                                <TableCell align="right">Threshold</TableCell>
                                                <TableCell align="right">Actions Required</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {accounts.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell>
                                                        <a onClick={() => {
                                                            localStorage.setItem('multisigAddress', JSON.stringify(row))
                                                        }}
                                                            href={`/multisig/${row.address}/txs`}>{row?.name}</a>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <a
                                                            onClick={() => {
                                                                localStorage.setItem('multisigAddress', JSON.stringify(row))
                                                            }}
                                                            href={`/multisig/${row.address}/txs`}> {row?.address}</a>
                                                    </TableCell>
                                                    <TableCell align="center">{row?.pubkeyjson?.value?.threshold || 0}</TableCell>
                                                    <TableCell align="center">
                                                        <strong> {row?.txns?.length || 0} </strong>  txns
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </FormControl> : null
                    }

                    {
                        open ? <DialogCreateMultisig
                            addressPrefix={addressPrefix}
                            chainId={chainId}
                            onClose={onClose}
                            open={open} /> : null
                    }


                </Paper>
            </Grid>
            <Grid item xs={1} md={1}></Grid>
        </Grid>
    )
}