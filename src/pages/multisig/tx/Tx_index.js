import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableCell, TableRow, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from 'react-redux'
import { getBalance } from '../../../features/bank/bankSlice';
import { getDelegations, getValidators } from '../../../features/staking/stakeSlice';
import List_txs from './List_txs';
import DialogCreateMultisigTx from '../../../components/DialogCreateMultisigTx';
import { fetchSingleMultiAccount, getMultisigAccount } from '../../../features/multisig/multisigSlice';

export const Tx_index = ({ }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { address: multisigAddress } = useParams();
    const multisigAccountDetails = useSelector(state => state.multisig.multisigAccount)
    const multisigAccount = multisigAccountDetails?.data?.data || {};
    const [showCreateTxn, SetShowCreateTxn] = useState(false);
    const multisigBal = useSelector(state => state.bank.balance)
    const multisigDel = useSelector(state => state.staking.delegations)
    const currency = useSelector((state) => state.wallet.chainInfo?.config?.currencies[0]);
    const [totalStake, setTotalStaked] = useState(0);

    useEffect(() => {
        let delegations = multisigDel?.delegations || []
        let total = 0.0
        if (delegations.length > 0) {
            for (let i = 0; i < delegations.length; i++)
                total += parseFloat(delegations[i].delegation.shares) / (10 ** currency?.coinDecimals)
        }
        setTotalStaked(total?.toFixed(6));
    }, [multisigDel])


    const wallet = useSelector((state) => state.wallet);
    const { chainInfo, address, connected } = wallet;

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        dispatch(fetchSingleMultiAccount(multisigAddress))
    }, [])

    useEffect(() => {
        if (connected) {
            dispatch(getBalance({
                baseURL: chainInfo.config.rest,
                address: multisigAddress,
                denom: chainInfo?.config?.currencies[0].coinMinimalDenom
            }))

            dispatch(getValidators({
                baseURL: chainInfo.config.rest,
                status: null,
            }))

            dispatch(getDelegations({
                baseURL: chainInfo.config.rest,
                address: multisigAddress,
            }))
        }
    }, [chainInfo]);

    return (
        <Grid container>
            <Grid item xs={12} md={12}>
                <Grid>
                    <Paper align="left" className='mt-20'>
                        <a align="left" href='javascript:void(0);' onClick={() => navigate('/multisig')}> Back</a>
                        <br /><br />
                    </Paper>
                    <Paper align="left" className='mt-20'>
                        {
                            multisigAccountDetails?.status === 'pending' ? <CircularProgress /> :
                                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box>
                                        <Table>
                                            <TableRow>
                                                <TableCell>Multisig Account</TableCell>
                                                <TableCell> <strong>{multisigAddress}</strong></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Threshold</TableCell>
                                                <TableCell> <strong> {multisigAccount?.pubkeyJSON?.value?.threshold || 0}</strong></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Signers</TableCell>
                                                <TableCell> {
                                                    multisigAccount?.pubkeyJSON?.value?.pubkeys?.map(p => (
                                                        <p><strong>{p?.address}</strong></p>
                                                    ))
                                                }</TableCell>
                                            </TableRow>
                                        </Table>
                                    </Box>
                                    <Box alignSelf={'right'}>
                                        <Table>
                                            <TableRow>
                                                <TableCell>
                                                    Balance
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        multisigBal.status === 'pending' ?
                                                            <CircularProgress /> :
                                                            <strong>
                                                                {multisigBal?.balance?.amount/10**currency?.coinDecimals} &nbsp;
                                                                {currency?.coinDenom}
                                                            </strong>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Staked
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        multisigDel?.status === 'pending' ?
                                                            <CircularProgress /> :
                                                            <strong>{totalStake} {currency?.coinDenom}</strong>
                                                    }

                                                </TableCell>
                                            </TableRow>
                                        </Table>
                                    </Box>
                                </Box>
                        }

                        {/* <Box>
                            Multisig Account: <strong>{multisigAddress}</strong>
                        </Box>
                        <Box>
                            Threshold: <strong>{
                                multisigAccount?.pubkeyJSON?.value?.threshold
                            }</strong>
                        </Box> */}
                    </Paper>
                </Grid>

                <Paper elevation={0} style={{ padding: 24 }}>
                    <Typography
                        variant='h6'
                        fontWeight={600}
                        color='text.primary'
                    >
                        Transactions
                    </Typography>

                    <Box>
                        <Paper elevation={0} style={{ padding: 24 }}>
                            <Button onClick={() => setOpen(true)}
                                className='text-right'>+ Create Txn</Button>
                        </Paper>
                    </Box>
                    <List_txs address={multisigAddress} />
                </Paper>
                <DialogCreateMultisigTx
                    open={open}
                    handleClose={handleClose}
                />
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Tx_index)