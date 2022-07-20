import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    IconButton, Table, TableBody, Paper,
    TableCell, TableContainer, TableRow, TableHead, CircularProgress
} from '@mui/material'
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSingleMultiAccount, getSigns, getTxns } from '../../../features/multisig/multisigSlice';
import BroadcastTx from '../BroadcastTx';
import SignTxn from '../SignTxn';
import InfoIcon from '@mui/icons-material/Info';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMultisigAccount } from '../../../features/multisig/multisigService';

const mapTxns = {
    '/cosmos.staking.v1beta1.MsgDelegate': 'Msg Delegate',
    '/cosmos.bank.v1beta1.MsgSend': 'Msg Send',
    '/cosmos.staking.v1beta1.MsgBeginRedelegate': 'Msg Re-Delegate',
    '/cosmos.staking.v1beta1.MsgUndelegate': 'Msg Un-Delegate',
    'Msg': 'Tx Msg'
}

const TableRowComponent = ({ tx }) => {
    const navigate = useNavigate();
    const { address } = useParams();
    const walletAddress = useSelector((state) => state.wallet.address);

    const multisigAccountDetails = useSelector(state => state.multisig.multisigAccount)
    const multisigAccount = multisigAccountDetails?.data?.data || {};

    const threshold = Number(multisigAccount?.pubkeyJSON?.value?.threshold || 0)
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const signatures = useSelector(state => state.multisig.signatures?.data?.data || [])

    const getAllSignatures = () => {
        let txId = tx?._id
        dispatch(getSigns({ address: multisigAccount?.address, txId }))
    }

    const getMultisignatureAcc = () => {
        dispatch(fetchSingleMultiAccount(address || ''))
    }

    useEffect(() => {
        getAllSignatures();
        getMultisignatureAcc()
    }, [])

    const isWalletSigned = () => {
        let signs = tx?.signatures || []
        let existedAddress = signs.filter(k => k.address === walletAddress)

        if (existedAddress && existedAddress.length) return true
        else return false
    }

    const isReadyToBroadcast = () => {
        let signs = tx?.signatures || [];
        if (signs.length >= threshold) return true
        else return false
    }

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    {
                        tx?.msgs.map(msg => (
                            <>
                                {
                                    msg.typeUrl === '/cosmos.bank.v1beta1.MsgSend' ?
                                        <span>
                                            <p style={{ textAlign: 'center' }}>{mapTxns[msg?.typeUrl]}</p>
                                            <p style={{ textAlign: 'center' }}>
                                                <strong>
                                                    {msg?.value?.amount[0].amount + ' ' +
                                                        msg?.value?.amount[0].denom
                                                    }</strong>
                                            </p>
                                            <p style={{ textAlign: 'center' }}>
                                                {msg?.value?.fromAddress.substring(0, 10) + '....'}
                                                {msg?.value?.fromAddress.substring(msg?.value?.fromAddress.length - 30, 5)}
                                                <ArrowRightAltIcon style={{
                                                    width: 100
                                                }} />  {
                                                    msg?.value?.toAddress.substring(0, 10) + '....'
                                                }
                                                {
                                                    msg?.value?.toAddress.substring(msg?.value?.toAddress.length - 30, 5)
                                                }
                                            </p>
                                        </span> : null
                                }

                                {
                                    msg.typeUrl === '/cosmos.staking.v1beta1.MsgDelegate' ?
                                        <span>
                                            <p style={{ textAlign: 'center' }}>{mapTxns[msg?.typeUrl]}</p>
                                            <p style={{ textAlign: 'center' }}>
                                                <strong>
                                                    {msg?.value?.amount?.amount + ' ' +
                                                        msg?.value?.amount?.denom
                                                    }</strong>
                                            </p>
                                            <p style={{ textAlign: 'center' }}>
                                                {msg?.value?.delegatorAddress.substring(0, 10) + '....'}
                                                {msg?.value?.delegatorAddress.substring(msg?.value?.delegatorAddress.length - 30, 5)}
                                                <ArrowRightAltIcon style={{
                                                    width: 100
                                                }} />  {
                                                    msg?.value?.validatorAddress.substring(0, 10) + '....'
                                                }
                                                {
                                                    msg?.value?.validatorAddress.substring(msg?.value?.validatorAddress.length - 30, 5)
                                                }
                                            </p>
                                        </span> : null
                                }
                            </>
                        ))
                    }
                </TableCell>
                <TableCell>
                    {
                        tx?.signatures.length
                    }
                </TableCell>
                <TableCell align='right'>
                    {
                        tx?.signatures.length || 0 >= threshold ?
                            <span>{
                                tx?.status === 'DONE' ? 'DONE' : 'Waiting for brodcast'
                            }</span>
                            :
                            <span>{
                                !isWalletSigned() ? 'Waiting for your sign' :
                                    'Waiting for others to sign'
                            }</span>
                    }

                </TableCell>
                <TableCell align='right'>
                    {
                        isReadyToBroadcast() ?
                            tx?.status === 'DONE' ? 'DONE' :
                                <BroadcastTx
                                    tx={tx}
                                    signatures={tx?.signatures}
                                    multisigAccount={multisigAccount}
                                /> :
                            <SignTxn
                                multisigAccount={multisigAccount}
                                signatures={tx?.signatures}
                                txId={tx?._id}
                                tx={tx}
                            />
                    }
                </TableCell>
                <TableCell align='right'>
                    <IconButton
                        align="right"
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        <h5>RawLog</h5>
                        {open ? <KeyboardArrowUpIcon align="right" /> : <KeyboardArrowDown
                            align="right" />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ width: '50%', paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <pre style={{ width: 100 }}>
                            {JSON.stringify(tx, null, 2)}
                        </pre>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

function List_txs({ address }) {
    const dispatch = useDispatch();
    const txns = useSelector(state => state.multisig.txns?.data?.data || []);
    const walletAddress = useSelector((state) => state.wallet.address);
    const createTxRes = useSelector(state => state.multisig.createTxnRes)

    const createSignRes = useSelector(state => state.multisig.createSignRes)
    const updateTxnStatus = useSelector(state => state.multisig.updateTxn)


    const getAllTxns = () => {
        dispatch(getTxns(address))
    }

    useEffect(() => {
        dispatch(getTxns(address))
    }, [updateTxnStatus])


    useEffect(() => {
        console.log('create sign ressssssssss', createSignRes)
        getAllTxns();
    }, [createSignRes])

    useEffect(() => {
        getAllTxns();
    }, [createTxRes])

    useEffect(() => {
        getAllTxns();
    }, [])

    return (
        <TableContainer component={Paper}>
            <Box>
                {
                    txns?.status !== 'pending' && !txns.length ?
                        <span> <strong style={{
                            color: '#8c3030'
                        }}> <InfoIcon style={{ top: 2 }}></InfoIcon>
                            No transactions found.
                        </strong>
                        </span> :
                        null

                }
                {
                    txns?.status === 'pending' ?
                        <CircularProgress size={40} /> : null
                }
            </Box>

            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        {/* <TableCell>Type</TableCell> */}
                        <TableCell>Msgs</TableCell>
                        <TableCell>No of Signatures</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {txns.map((row) => (
                        <TableRowComponent tx={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default List_txs