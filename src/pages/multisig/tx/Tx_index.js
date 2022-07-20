import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from 'react-redux'
import { getBalance } from '../../../features/bank/bankSlice';
import { getDelegations, getValidators } from '../../../features/staking/stakeSlice';
import List_txs from './List_txs';
import DialogCreateMultisigTx from '../../../components/DialogCreateMultisigTx';

export const Tx_index = ({ }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { address: multisigAddress } = useParams();
    const multisigAccountDetails = useSelector(state => state.multisig.multisigAccount)
    const multisigAccount = multisigAccountDetails?.data?.data || {};

    // const multisigAccount = localStorage.getItem('multisigAddress') &&
    //     JSON.parse(localStorage.getItem('multisigAddress')) || {};
    const [showCreateTxn, SetShowCreateTxn] = useState(false);


    const wallet = useSelector((state) => state.wallet);
    const { chainInfo, address, connected } = wallet;

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        if (connected) {
            dispatch(getBalance({
                baseURL: chainInfo.config.rest,
                address: address,
                denom: chainInfo?.config?.currencies[0].coinMinimalDenom
            }))

            dispatch(getValidators({
                baseURL: chainInfo.config.rest,
                status: null,
            }))

            dispatch(getDelegations({
                baseURL: chainInfo.config.rest,
                address: address,
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
                    <Paper className='mt-20'>
                        <Box>
                            Multisig Account: <strong>{multisigAddress}</strong>
                        </Box>
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