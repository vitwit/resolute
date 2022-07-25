import {
    Button, TextField, Paper,
    Typography, Grid,
    InputAdornment, Select,
    Box, FormControl, InputLabel, MenuItem
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { calculateFee } from "@cosmjs/stargate";
import { useDispatch, useSelector } from 'react-redux';
import { Decimal } from "@cosmjs/math";
import { getBalance } from '../../features/bank/bankSlice';
import { getDelegations, getParams, getValidators } from '../../features/staking/stakeSlice';
import { setDate } from 'date-fns';
import { createTxn, getSigns, getTxns } from '../../features/multisig/multisigSlice';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SignTxn from './SignTxn';
import BroadcastTx from './BroadcastTx';
import { fee } from '../../txns/execute';

const mapTxns = {
    '/cosmos.staking.v1beta1.MsgDelegate': 'Msg Delegate',
    '/cosmos.bank.v1beta1.MsgSend': 'Msg Send',
    'Msg': 'Tx Msg'
}

const TableRowComponent = ({ tx }) => {
    const multisigAccount = localStorage.getItem('multisigAddress') && JSON.parse(localStorage.getItem('multisigAddress'))
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const signatures = useSelector(state => state.multisig.signatures?.data?.data || [])

    // dispatch(getSigns(localStorage.getItem('multisigAddress')), tx?._id)

    const getAllSignatures = () => {
        let txId = tx?._id
        dispatch(getSigns({ address: multisigAccount?.address, txId }))

    }

    useEffect(() => {
        getAllSignatures();
    }, [])

    const isThresholdMatch = (tx, signatures) => {
        let cond = signatures?.length >= Number(multisigAccount?.pubkeyJSON?.value?.threshold || 0) ? true : false;
        
        return true;
    }

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                        mapTxns[tx?.msgs && tx.msgs?.length && tx.msgs[0].typeUrl || 'Msg']
                    }
                    <span>
                        {
                            isThresholdMatch(tx, signatures) ?
                                <BroadcastTx signatures={signatures} tx={tx} />
                                : <SignTxn getAllSignatures={getAllSignatures} tx={tx} />
                        }
                    </span>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <pre>
                            {JSON.stringify(tx, null, 2)}
                        </pre>

                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

const TxnsComponent = ({ address }) => {
    const dispatch = useDispatch();
    const txns = useSelector(state => state.multisig.txns?.data?.data || []);
    const walletAddress = useSelector((state) => state.wallet.address);

    useEffect(() => {
        dispatch(getTxns(address))
    }, [])

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableBody>
                    {txns.map((row) => (
                        <TableRowComponent tx={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )


}

export default function CreateTxn({ handleNext }) {
    const multisigAccount = localStorage.getItem('multisigAddress') &&
        JSON.parse(localStorage.getItem('multisigAddress')) || {}
    const [txType, setTxType] = React.useState('');
    const [showCreateTxn, SetShowCreateTxn] = React.useState(false);

    const dispatch = useDispatch();

    const walletAddress = useSelector((state) => state.wallet.address);

    const [obj, setObj] = useState({});
    const wallet = useSelector((state) => state.wallet);

    const balance = useSelector((state) => state.bank.balance);
    const { chainInfo, address, connected } = wallet;
    const currency = useSelector((state) => state.wallet.chainInfo.currencies[0]);
    const createTxRes = useSelector(state => state.multisig.createTxnRes)

    const validators = useSelector((state) => state.staking.validators);

    useEffect(() => {
        if (connected) {
            dispatch(getBalance({
                baseURL: chainInfo.lcd,
                address: address,
                denom: chainInfo?.currencies[0].coinMinimalDenom
            }))
            dispatch(getValidators({
                baseURL: chainInfo.lcd,
                status: null,
            }))

            dispatch(getDelegations({
                baseURL: chainInfo.lcd,
                address: address,
            }))
        }
    }, [chainInfo]);

    useEffect(() => {
        if (connected) {
            if (validators.pagination?.next_key !== null) {
                dispatch(getValidators({
                    baseURL: chainInfo.lcd,
                    status: null,
                    pagination: {
                        key: validators.pagination.next_key,
                        limit: null
                    }
                }))
            }
        }
    }, [validators.pagination]);

    const handleTypeChange = (event) => {
        setTxType(event.target.value);
    };

    const createTransaction = ({ toAddress, amount, memo, gas }) => {
        const multisigAddress = localStorage.getItem('multisigAddress')
            && JSON.parse(localStorage.getItem('multisigAddress')) || {}

        const amountInAtomics = Decimal.fromUserInput(
            amount,
            Number(chainInfo.currencies[0].coinDecimals),
        ).atomics;

        if (txType === 'send') {
            const msgSend = {
                fromAddress: multisigAddress?.address,
                toAddress: toAddress,
                amount: [
                    {
                        amount: amountInAtomics,
                        denom: chainInfo.currencies[0].coinMinimalDenom,
                    },
                ],
            };

            const msg = {
                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                value: msgSend,
            };

            const feeObj = fee(chainInfo?.config.currencies[0].coinMinimalDenom,
                chainInfo?.config?.gasPriceStep?.average,
                300000)
            // const fee = calculateFee(Number(100000), '0.000001stake');

            return {
                chainId: chainInfo?.chainId,
                msgs: [msg],
                fee: feeObj,
                memo: memo,
            };
        } else if (txType === 'delegate') {
            const msgSend = {
                delegatorAddress: multisigAddress?.address,
                validatorAddress: toAddress,
                amount: {
                    amount: amountInAtomics,
                    denom: chainInfo.currencies[0].coinMinimalDenom,
                },
            };

            const msg = {
                typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                value: msgSend,
            };

            const feeObj = fee(chainInfo?.config.currencies[0].coinMinimalDenom,
                chainInfo?.config?.gasPriceStep?.average,
                300000)

            return {
                chainId: chainInfo?.chainId,
                msgs: [msg],
                fee: feeObj,
                memo: memo,
                gas: gas
            };
        }
    };

    const handleChange = (e) => {
        obj[e.target.name] = e.target.value;
        setObj({ ...obj });
    }

    const handleSubmit = (e, obj = { obj }) => {
        e.preventDefault();
        if (obj['validator_address']) {
            obj['toAddress'] = obj['validator_address']
        }
        let txn = createTransaction(obj);
        txn.address = walletAddress;
        dispatch(createTxn(txn))
    }

    const SendForm = ({ handleSubmit, handleChange, obj }) => {
        const handleSubmit1 = (e) => {
            e.preventDefault();
            handleSubmit(e, obj);
        }
        return (
            <form onSubmit={handleSubmit1}>
                <TextField
                    name="toAddress"
                    value={obj.toAddress}
                    onChange={handleChange}
                    label="To Address"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="amount" value={obj.amount} onChange={handleChange}
                    label="Amount"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                    }}
                />
                <TextField
                    name="gas" value={obj.gas} onChange={handleChange}
                    label="Gas"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="memo" value={obj.memo} onChange={handleChange}
                    label="Memo"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <Button type="submit" variant='contained' disableElevation
                    style={{ marginTop: 16 }}
                    className='button-capitalize-title'

                >Create Transaction</Button>
            </form>
        )
    }

    const DelegateForm = ({ handleSubmit, validators }) => {
        validators = validators && validators.active || {};
        const [valAddress, setValAddress] = useState(null);
        var [data, setData] = useState([]);
        const [obj, setObj] = useState({})

        const handleChange = (e) => {
            obj[e.target.name] = e.target.value;
            setObj({ ...obj });
        }

        useEffect(() => {
            data = [];
            Object.entries(validators).map(([k, v], index) => {
                let obj1 = {
                    value: k,
                    label: v.description.moniker
                }

                data = [...data, obj1];
            })

            setData([...data])
        }, [validators])


        const handleChange1 = (e) => {
            setValAddress(e.target.value);
            let o = JSON.parse(e.target.value);
            obj['validator_address'] = o.value;

            setObj({ ...obj })
        }

        return (
            <form onSubmit={(e) => handleSubmit(e, obj)}>
                <br /><br />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Select Validator
                    </InputLabel>
                    <Select
                        name="toAddress"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={valAddress}
                        label="Select Validator"
                        onChange={handleChange1}
                    >
                        {
                            data.map((v, k) =>
                                <MenuItem value={JSON.stringify(v)}>{v.label}</MenuItem>
                            )
                        }

                    </Select>
                </FormControl>
                <TextField
                    name="amount" value={obj.amount} onChange={handleChange}
                    label="Amount"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                    }}
                />
                <TextField
                    name="gas" value={obj.gas} onChange={handleChange}
                    label="Gas"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="memo" value={obj.memo} onChange={handleChange}
                    label="Memo"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <Button type="submit" variant='contained' disableElevation
                    style={{ marginTop: 16 }}
                    className='button-capitalize-title'

                >Create Transaction</Button>
            </form>
        )
    }

    const UndelegateForm = ({ handleSubmit, handleChange, obj }) => {
        return (
            <form onSubmit={handleSubmit}>
                <TextField
                    name="toAddress"
                    value={obj.toAddress}
                    onChange={handleChange}
                    label="To Address"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="amount" value={obj.amount} onChange={handleChange}
                    label="Amount"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                    }}
                />
                <TextField
                    name="gas" value={obj.gas} onChange={handleChange}
                    label="Gas"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="memo" value={obj.memo} onChange={handleChange}
                    label="Memo"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <Button type="submit" variant='contained' disableElevation
                    style={{ marginTop: 16 }}
                    className='button-capitalize-title'
                >Create Transaction</Button>
            </form>
        )
    }

    const RedelegateForm = ({ handleSubmit, handleChange, obj }) => {
        return (
            <form onSubmit={handleSubmit}>
                <TextField
                    name="toAddress"
                    value={obj.toAddress}
                    onChange={handleChange}
                    label="To Address"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="amount" value={obj.amount} onChange={handleChange}
                    label="Amount"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                    }}
                />
                <TextField
                    name="gas" value={obj.gas} onChange={handleChange}
                    label="Gas"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <TextField
                    name="memo" value={obj.memo} onChange={handleChange}
                    label="Memo"
                    fullWidth
                    style={{ marginTop: 8, marginBottom: 8 }}
                />
                <Button type="submit" variant='contained' disableElevation
                    style={{ marginTop: 16 }}
                    className='button-capitalize-title'

                >Create Transaction</Button>
            </form>
        )
    }

    return (
        <Grid container>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={10} md={8}>
                <Grid>
                    <Paper className='mt-20'>
                        <br /><br />
                        <Box>
                            Multisig Account: <strong>{multisigAccount?.address}</strong>
                        </Box>
                    </Paper>
                </Grid>
                <Box>
                    <Paper elevation={0} style={{ padding: 24 }}>
                        <Button onClick={() => SetShowCreateTxn(!showCreateTxn)}
                            className='text-right'>+ Create Txn</Button>
                    </Paper>
                    <Paper>
                        <TxnsComponent address={address} />
                    </Paper>
                </Box>
                {
                    showCreateTxn ?
                        <Paper elevation={0} style={{ padding: 24 }}>
                            <Typography
                                variant='h6'
                                fontWeight={600}
                                color='text.primary'
                            >
                                Create Transaction
                            </Typography>
                            <Box>
                                <Box sx={{ minWidth: 120 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Select Tx Type
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={txType}
                                            label="Select Tx Type"
                                            onChange={handleTypeChange}
                                        >
                                            <MenuItem value={'send'}>Send</MenuItem>
                                            <MenuItem value={'delegate'}>Delegate</MenuItem>
                                            <MenuItem value={'redelegate'}>Re-Delegate</MenuItem>
                                            <MenuItem value={'undelegate'}>Un-Delegate</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                {
                                    txType === 'send' ? <SendForm
                                        handleSubmit={handleSubmit}
                                        obj={obj}
                                        handleChange={handleChange} /> : null
                                }

                                {
                                    txType === 'delegate' ? <DelegateForm
                                        handleSubmit={handleSubmit}
                                        obj={obj}
                                        validators={validators}
                                        handleChange={handleChange} /> : null
                                }

                                {
                                    txType === 'redelegate' ? <RedelegateForm
                                        handleSubmit={handleSubmit}
                                        obj={obj}
                                        handleChange={handleChange} /> : null
                                }

                                {
                                    txType === 'undelegate' ? <UndelegateForm
                                        handleSubmit={handleSubmit}
                                        obj={obj}
                                        handleChange={handleChange} /> : null
                                }
                            </Box>

                        </Paper> : null
                }

            </Grid>
            <Grid item xs={1} md={2}></Grid>
        </Grid>

    )
}
