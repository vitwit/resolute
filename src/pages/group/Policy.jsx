import {
    Box, Button, FormControl,
    Paper,
    Grid,
    TextField, Typography, InputAdornment, IconButton, FormLabel, MenuItem, Select, InputLabel, Card, CircularProgress, Alert,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { experimentalStyled as styled } from '@mui/material/styles';
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ProposalSendForm from './ProposalSendForm';
import ProposalDelegateForm from './ProposalDelegateForm';
import ProposalRedelegateForm from './ProposalRedelegateForm';
import ProposalUndelegateForm from './ProposalUndelegateForm';
import RowItem from '../../components/group/RowItem';
import { getAmountObj, getLocalStorage, proposalStatus, shortenAddress } from '../../utils/util';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupPolicyProposals, txCreateGroupProposal, txGroupProposalExecute, txGroupProposalVote, txUpdateGroupPolicy, txUpdateGroupPolicyAdmin, txUpdateGroupPolicyMetdata } from '../../features/group/groupSlice';
import { useNavigate, useParams } from 'react-router-dom';
import DialogVote from '../../components/group/DialogVote';
import EastIcon from '@mui/icons-material/East';
import PolicyForm from '../../components/group/PolicyForm';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

const DELEGATE_MSG = `/cosmos.staking.v1beta1.MsgDelegate`;
const SEND_MSG = `/cosmos.bank.v1beta1.MsgSend`;

const voteStatus = {
    STATUS_CLOSED: 'Closed',
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    boxShadow: 'none',
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const DelegateMsgComponent = ({ msg, index, deleteMsg }) => {
    return (
        <Box sx={{ m: 2, p: 2, textAlign: 'left', border: '1px solid' }}>
            <strong>Delegate </strong>
            {`${msg?.value?.amount?.amount} `}
            {`${msg?.value?.amount?.denom} `}
            <strong> To </strong>
            {
                shortenAddress(msg?.value?.validatorAddress, 30)
            }
            <strong >
                <DeleteOutline
                    onClick={() => deleteMsg(index)}
                    sx={{ float: 'right', color: 'red' }}>

                </DeleteOutline>
            </strong>
        </Box>
    )
}

const SendMsgComponent = ({ msg, index, deleteMsg }) => {
    return (
        <Box sx={{ m: 2, p: 2, textAlign: 'left', border: '1px solid' }}>
            <strong>Send </strong>
            {`${msg?.value?.amount?.[0]?.amount} `}
            {`${msg?.value?.amount?.[0]?.denom} `}
            <strong> To </strong>
            {
                shortenAddress(msg?.value?.toAddress, 30)
            }
            <strong >
                <DeleteOutline
                    onClick={() => deleteMsg(index)}
                    sx={{ float: 'right', color: 'red' }}>

                </DeleteOutline>
            </strong>
        </Box>
    )
}

const CreateProposal = ({ policyInfo }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const wallet = useSelector(state => state.wallet);
    const [showMsgFrom, setShowMsgForm] = useState(true);
    const denom = wallet?.chainInfo?.config?.currencies?.[0].coinMinimalDenom || '-'
    console.log('wallet', wallet)
    const proposerObj = {
        name: 'proposer',
        placeholder: 'Enter Proposer Address',
        value: '',
    }

    const [showCreateProposal, setShowCreateProposal] = useState(false);
    var [proposers, setProposers] = useState([{ ...proposerObj }]);
    const createProposalRes = useSelector(state => state.group.groupProposalRes)
    const [obj, setObj] = useState({
        groupPolicyAddress: policyInfo?.address || '',
        messages: []
    });

    const handleAddProposer = () => {
        proposers = [...proposers, proposerObj];
        setProposers([...proposers]);
    }

    const handleChange = e => {
        obj[e.target.name] = e.target.value;
        setObj({ ...obj });
    }

    const handleMsgChange = msgObj => {
        let message = {};
        if (msgObj?.typeUrl === DELEGATE_MSG) {
            let val = JSON.parse(msgObj?.validatorAddress)
            message = {
                typeUrl: msgObj?.typeUrl,
                value: {
                    delegatorAddress: msgObj?.delegatorAddress,
                    validatorAddress: val?.value,
                    amount: getAmountObj(msgObj?.amount, wallet?.chainInfo)
                }
            }
        }

        if (msgObj?.typeUrl === SEND_MSG) {
            message = {
                typeUrl: msgObj?.typeUrl,
                value: {
                    fromAddress: msgObj?.fromAddress,
                    toAddress: msgObj?.toAddress,
                    amount: [getAmountObj(msgObj?.amount, wallet?.chainInfo)]
                }
            }
        }

        obj.messages = [...obj?.messages, message];
        setObj({ ...obj });
        setShowMsgForm(false);
    }

    const onRemove = (index) => {
        proposers.splice(index, 1);
        setProposers([...proposers])
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        obj['proposers'] = proposers.map(p => p.value);
        obj['admin'] = wallet?.address;
        obj['chainId'] = wallet?.chainInfo?.config?.chainId
        obj['rpc'] = wallet?.chainInfo?.config?.rpc;
        obj['denom'] = wallet?.chainInfo?.config?.currencies?.[0]?.coinMinimalDenom || ''
        obj['feeAmount'] = wallet?.chainInfo?.config?.gasPriceStep?.average || 0
        dispatch(txCreateGroupProposal(obj));
    }

    const deleteMsg = i => {
        obj.messages.splice(i, 1);
        setObj({ ...obj })
    }

    return (
        <Box>
            <Button sx={{ float: 'right', mt: 3, mb: 3 }}
                variant='outlined'
                onClick={() => setShowCreateProposal(!showCreateProposal)}>
                Create Proposal
            </Button>

            {
                showCreateProposal ?

                    <Card sx={{ width: '100%', p: 3 }}>
                        <Box sx={{ width: '50%', m: '0 auto' }}>
                            <br />
                            <h3>Create Proposal</h3>

                            <form onSubmit={handleSubmit}>
                                <FormControl fullWidth>
                                    <TextField
                                        disabled
                                        fullWidth
                                        name='groupPolicyAddress'
                                        placeholder='Address'
                                        value={obj?.groupPolicyAddress}
                                        onChange={handleChange}
                                    />
                                </FormControl><br /><br />
                                <br /><br />
                                {
                                    proposers.map((p, pIndex) => (
                                        <FormControl fullWidth key={pIndex}>
                                            <TextField
                                                key={pIndex}
                                                fullWidth
                                                name={p?.name}
                                                value={p?.value}
                                                placeholder={p?.placeholder}
                                                onChange={(e) => {
                                                    let proposerObj = proposers[pIndex];
                                                    proposerObj.value = e.target.value;
                                                    proposers[pIndex] = proposerObj;
                                                    setProposers([...proposers])
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {
                                                                proposers.length > 1 ?
                                                                    <IconButton
                                                                        aria-label="remove member"
                                                                        color="error"
                                                                        onClick={() => onRemove(pIndex)}
                                                                    >
                                                                        <DeleteOutline />
                                                                    </IconButton> : null
                                                            }
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <br />
                                        </FormControl>
                                    ))
                                }
                                <FormControl sx={{ float: 'right', }}>
                                    <Button onClick={() => {
                                        handleAddProposer()
                                    }} variant='contained' >
                                        Add Another proposer + </Button><br />
                                </FormControl><br /><br /><br />



                                <FormLabel sx={{
                                    textAlign: 'left'
                                }}>
                                    <Typography sx={{ fontSize: 21, m: 3 }}>Add Messages</Typography>
                                </FormLabel>

                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Select Transaction Type
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="txType"
                                        label="Select Transaction Type"
                                        onChange={(e) => {
                                            setObj({ ...obj, txType: e.target.value })
                                            setShowMsgForm(true);
                                        }}
                                    >
                                        <MenuItem value={'send'}>Send</MenuItem>
                                        <MenuItem value={'delegate'}>Delegate</MenuItem>
                                        {/* <MenuItem value={'redelegate'}>Re-Delegate</MenuItem>
                                        <MenuItem value={'undelegate'}>Un-Delegate</MenuItem> */}
                                    </Select>
                                </FormControl>

                                <br /><br />

                                {
                                    showMsgFrom && (
                                        <Box>
                                            {
                                                obj.txType === 'send' ? <ProposalSendForm
                                                    fromAddress={params?.policyId || ''}
                                                    handleMsgChange={handleMsgChange}
                                                    type={SEND_MSG}
                                                    denom={denom}
                                                /> : null
                                            }

                                            {
                                                obj.txType === 'delegate' ? <ProposalDelegateForm
                                                    fromAddress={params?.policyId || ''}
                                                    handleMsgChange={handleMsgChange}
                                                    type={DELEGATE_MSG}
                                                    chainInfo={wallet?.chainInfo}
                                                /> : null
                                            }

                                            {
                                                obj.txType === 'redelegate' ? <ProposalRedelegateForm /> : null
                                            }

                                            {
                                                obj.txType === 'undelegate' ? <ProposalUndelegateForm
                                                    address={params?.policyId || ''}
                                                    handleMsgChange={handleMsgChange}
                                                    type={DELEGATE_MSG}
                                                    chainInfo={wallet?.chainInfo}
                                                /> : null
                                            }
                                        </Box>
                                    )
                                }


                                {
                                    obj?.messages?.length &&
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography sx={{ fontSize: 20 }}>Messages</Typography>
                                        <Box>
                                            {
                                                obj?.messages?.map((m, i) => (
                                                    m.typeUrl === SEND_MSG && (<SendMsgComponent msg={m}
                                                        index={i}
                                                        deleteMsg={deleteMsg} />) ||
                                                    m.typeUrl === DELEGATE_MSG && (<DelegateMsgComponent msg={m}
                                                        index={i}
                                                        deleteMsg={deleteMsg} />)
                                                ))
                                            }
                                        </Box>
                                    </Box>
                                    || null}

                                <br /><br />
                                <Box>

                                    <Button color='error'
                                        sx={{ mr: 3 }}
                                        onClick={() => setShowCreateProposal(false)}
                                        variant='outlined' type="submit">
                                        Cancel
                                    </Button>
                                    <Button variant='outlined' type="submit">
                                        {
                                            createProposalRes.status === 'pending' ?
                                                'Submitting....' : 'Submit'
                                        }
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Card> : null
            }
        </Box>
    )
}

const AllProposals = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const proposals = useSelector(state => state.group?.proposals)
    const wallet = useSelector(state => state.wallet)
    const [voteOpen, setVoteOpen] = useState(false);
    const voteRes = useSelector(state => state.group?.voteRes);
    const createProposalRes = useSelector(state => state.group?.groupProposalRes);
    const navigate = useNavigate();

    const getProposals = () => {
        dispatch(getGroupPolicyProposals({
            baseURL: wallet?.chainInfo?.config?.rest,
            address: params?.policyId
        }))
    }

    useEffect(() => {
        if (createProposalRes?.status === 'idle')
            getProposals()

    }, [createProposalRes?.status])

    useEffect(() => {
        getProposals();
    }, [])

    const onVoteDailogClose = () => {
        setVoteOpen(false);
    }

    const onConfirm = (voteObj) => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txGroupProposalVote({
            admin: wallet?.address,
            voter: wallet?.address,
            option: voteObj?.vote,
            proposalId: voteObj?.proposalId,
            chainId: chainInfo?.config?.chainId,
            rpc: chainInfo?.config?.rpc,
            denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
            feeAmount: chainInfo?.config?.gasPriceStep?.average,
        }))
        console.log('vote objj', voteObj)
    }

    const onExecute = (proposalId) => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txGroupProposalExecute({
            proposalId: proposalId,
            admin: wallet?.address,
            executor: wallet?.address,
            chainId: chainInfo?.config?.chainId,
            rpc: chainInfo?.config?.rpc,
            denom: chainInfo?.config?.currencies?.[0]?.coinMinimalDenom,
            feeAmount: chainInfo?.config?.gasPriceStep?.average,
        }))
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <br /><br />
            <Typography sx={{ fontSize: 24, mb: 4 }}>All Proposals</Typography>
            <Grid container spacing={{ xs: 1, md: 1 }} md={12} >
                {
                    proposals?.status === 'pending' ?
                        <CircularProgress /> : null
                }

                {
                    proposals?.status !== 'pending' &&
                        !proposals?.data?.proposals?.length ?
                        <Card sx={{ width: '100%', p: 5 }}>
                            <Alert sx={{ textAlign: 'center' }} severity='info'>
                                No proposals found.
                            </Alert>
                        </Card>
                        : null
                }

                {proposals?.status !== 'pending' && proposals?.data?.proposals?.length &&
                    proposals?.data?.proposals?.map((p, index) => (
                        <Grid item xs={2} sm={4} md={6} key={index}>
                            <Item>
                                <Grid container>
                                    <Box sx={{ display: 'flex', width: '100%' }}>
                                        <Box sx={{ width: '90%' }}>
                                            <Typography sx={{
                                                fontSize: 21,
                                                textAlign: 'left',
                                                fontWeight: 'bold'
                                            }}>
                                                # {p?.id}
                                            </Typography>

                                            <Typography sx={{
                                                textAlign: 'left',
                                                p: 1,
                                                mt: 2,
                                                fontSize: 18,
                                                width: '30%',
                                                borderRadius: 25,
                                                textAlign: 'center',
                                                bgcolor: proposalStatus[p?.status]?.bgColor,
                                                color: proposalStatus[p?.status]?.textColor
                                            }}>
                                                {proposalStatus[p?.status]?.label || p?.status}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ float: 'right', }}>
                                            {
                                                p?.status === 'PROPOSAL_STATUS_SUBMITTED' ?
                                                    <Button
                                                        variant='outlined'
                                                        onClick={() => setVoteOpen(true)}
                                                        sx={{ float: 'right', justifyContent: 'right' }}>Vote</Button>
                                                    : null
                                            }

                                            {
                                                p?.status === 'PROPOSAL_STATUS_ACCEPTED' ?
                                                    <Button
                                                        variant='outlined'
                                                        onClick={() => onExecute(p?.id)}
                                                    >
                                                        Execute
                                                    </Button>
                                                    : null
                                            }

                                            <DialogVote
                                                proposalId={p?.id}
                                                voteRes={voteRes}
                                                selectedValue={'yes here'}
                                                onClose={onVoteDailogClose}
                                                onConfirm={onConfirm}
                                                open={voteOpen} />
                                        </Box>

                                    </Box>

                                    <Grid container>
                                        <Grid md={11}>
                                            <RowItem lable={p?.metadata} />
                                            <RowItem lable={'Group Policy Address'}
                                                value={shortenAddress(p?.group_policy_address, 19)} />
                                            <Grid container>
                                                <Grid md={4}>
                                                    <Typography sx={{
                                                        fontSize: 20,
                                                        float: 'left',
                                                        ml: 1
                                                    }}>
                                                        Proposers
                                                    </Typography>
                                                </Grid>
                                                <Grid md={8} >
                                                    {
                                                        p?.proposers?.map(p1 => (
                                                            <Typography sx={{
                                                                fontSize: 20,
                                                                float: 'left',
                                                                ml: 1,
                                                                fontWeight: 'bold'
                                                            }}>
                                                                -  {shortenAddress(p1, 19)}
                                                            </Typography>
                                                        ))
                                                    }
                                                </Grid>
                                            </Grid>
                                            <RowItem lable={'Submit Time'}
                                                value={p?.submit_time} />
                                            <RowItem lable={'Group Version'}
                                                value={p?.group_version} />
                                            <RowItem lable={'Result'} value={p?.result} />
                                            <RowItem lable={'Vote'} value={JSON.stringify(p?.vote_state, null, 2)}
                                            />
                                            <Grid container>
                                                <Grid md={4}>
                                                    <Typography sx={{
                                                        fontSize: 20,
                                                        float: 'left',
                                                        ml: 1
                                                    }}>Messages</Typography>
                                                </Grid>
                                                <Grid md={8}>

                                                    {
                                                        p?.messages?.map(m => (
                                                            <Box>
                                                                {
                                                                    m['@type'] === SEND_MSG ?
                                                                        <Box><Typography sx={{
                                                                            fontSize: 20,
                                                                            float: 'left'
                                                                        }}>
                                                                            <strong> - Send </strong>
                                                                            {
                                                                                `${m?.amount?.[0]?.amount} `
                                                                            }
                                                                            {
                                                                                `${m?.amount?.[0]?.denom} `
                                                                            }
                                                                            <strong> To </strong>
                                                                            {
                                                                                `${shortenAddress(m?.to_address, 19)}`
                                                                            }
                                                                        </Typography></Box> : null
                                                                }
                                                                {
                                                                    m['@type'] === DELEGATE_MSG ?
                                                                        <Box>
                                                                            <Typography sx={{
                                                                                fontSize: 20,
                                                                                float: 'left'
                                                                            }}>
                                                                                <strong> - Delegate </strong>
                                                                                {
                                                                                    `${m?.amount?.amount} `
                                                                                }
                                                                                {
                                                                                    `${m?.amount?.denom} `
                                                                                }
                                                                                <strong> To </strong>
                                                                                {
                                                                                    `${shortenAddress(m?.validator_address, 19)}`
                                                                                }
                                                                            </Typography></Box> : null
                                                                }
                                                            </Box>
                                                        ))
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid md={1}>
                                            <EastIcon
                                                onClick={() => {
                                                    navigate(`/groups/proposals/${p?.id}`)
                                                }}
                                                sx={{
                                                    height: '50%',
                                                    m: '0 auto',
                                                    fontSize: 35,
                                                    color: '#000'
                                                }} />
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                    )) || null}
            </Grid>
        </Box >
    )
}

function Policy() {
    const [showMetdataInput, setShowMetadataInput] = useState(false);
    const [showAdminInput, setShowAdminInput] = useState(false);
    const [metadata, setMetadata] = useState('');
    const [admin, setAdmin] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const dispatch = useDispatch();

    const wallet = useSelector(state => state.wallet);
    const updateMetadataRes = useSelector(state => state.group.updateGroupMetadataRes)

    let policyInfo = {};
    try {
        policyInfo = getLocalStorage('policy', 'object');
    } catch (error) {
        console.log('Errot while getting policy', error?.message)
    }

    useEffect(() => {
        if (updateMetadataRes?.status === 'idle')
            setShowMetadataInput(false);
    }, [updateMetadataRes?.status])

    const handleSubmitPolicy = (policyMetadata) => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txUpdateGroupPolicy({
            admin: policyInfo?.admin,
            groupPolicyAddress: policyInfo?.address,
            policyMetadata: policyMetadata,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const handlePolicyMetadata = () => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txUpdateGroupPolicyMetdata({
            admin: policyInfo?.admin,
            groupPolicyAddress: policyInfo?.address,
            metadata: metadata,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const handleUpdateAdmin = () => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txUpdateGroupPolicyAdmin({
            admin: policyInfo?.admin,
            groupPolicyAddress: policyInfo?.address,
            newAdmin: admin,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    return (
        <Box>
            <Typography sx={{ fontSize: 24 }}>Policy Information</Typography>

            <Button variant='outlined'
                onClick={() => setShowEditForm(true)}
                sx={{ float: 'right', mb: 9 }}>
                Update policy
            </Button>

            {
                showEditForm && <Item sx={{ mt: 8 }}><PolicyForm
                    policyObj={policyInfo}
                    handlePolicyClose={() => setShowEditForm(false)}
                    handlePolicy={handleSubmitPolicy} /></Item>
            }

            {
                !showEditForm && <Item sx={{ mt: 8 }}>
                    <Grid container >
                        <Grid md={8}>
                            <Grid sx={{
                                mb: 4
                            }} container>
                                <Grid md={4}>
                                    <Typography sx={{
                                        textAlign: 'left',
                                        fontSize: 18,
                                        ml: 1
                                    }}>Metdata</Typography>
                                </Grid>
                                <Grid md={4}>
                                    {
                                        showMetdataInput ?
                                            <TextField
                                                onChange={(e) => {
                                                    setMetadata(e.target.value)
                                                }}
                                                placeholder='Metadata'
                                                value={metadata}
                                            /> :
                                            <Typography
                                                sx={{
                                                    textAlign: 'left',
                                                    fontSize: 18,
                                                    ml: 2,
                                                    fontWeight: 'bold'
                                                }}>
                                                {policyInfo?.metadata || '-'}
                                            </Typography>
                                    }

                                </Grid>
                                <Grid sx={{ textAlign: 'left', ml: 1 }} md={2}>
                                    {
                                        showMetdataInput ?
                                            <>
                                                <Button
                                                    sx={{ mt: 1 }}
                                                    onClick={() => {
                                                        handlePolicyMetadata()
                                                    }}
                                                    variant='contained'>
                                                    Update
                                                </Button>
                                                <CancelIcon
                                                    onClick={() => {
                                                        setShowMetadataInput(false)
                                                    }}
                                                    sx={
                                                        { color: 'red', fontSize: 22, ml: 2 }
                                                    } />
                                            </>
                                            :
                                            <EditIcon onClick={
                                                () => {
                                                    setMetadata(policyInfo?.metadata)
                                                    setShowMetadataInput(!showMetdataInput)
                                                }
                                            } />
                                    }

                                </Grid>
                            </Grid>
                            <Grid sx={{ mb: 4 }} container>
                                <Grid md={4}>
                                    <Typography sx={{
                                        textAlign: 'left',
                                        fontSize: 18,
                                        ml: 1
                                    }}>Admin</Typography>
                                </Grid>
                                <Grid md={4}>
                                    {
                                        showAdminInput ?
                                            <TextField
                                                onChange={(e) => {
                                                    setAdmin(e.target.value)
                                                }}
                                                placeholder='Admin'
                                                value={admin}
                                            /> :
                                            <Typography sx={{
                                                textAlign: 'left',
                                                fontSize: 18,
                                                ml: 3,
                                                fontWeight: 'bold'
                                            }}>
                                                {shortenAddress(policyInfo?.admin, 19)}
                                            </Typography>
                                    }

                                </Grid>
                                <Grid sx={{ textAlign: 'left', ml: 1 }} md={2}>
                                    {
                                        showAdminInput ?
                                            <>
                                                <Button
                                                    sx={{ mt: 1 }}
                                                    onClick={() => {
                                                        handleUpdateAdmin()
                                                    }}
                                                    variant='contained'>
                                                    Update
                                                </Button>
                                                <CancelIcon
                                                    onClick={() => {
                                                        setShowAdminInput(false)
                                                    }}
                                                    sx={
                                                        { color: 'red', fontSize: 22, ml: 2 }
                                                    } />
                                            </>

                                            :
                                            <EditIcon onClick={
                                                () => {
                                                    setAdmin(policyInfo?.admin)
                                                    setShowAdminInput(!showAdminInput)
                                                }
                                            } />
                                    }

                                </Grid>
                            </Grid>

                            <RowItem lable={'Address'}
                                value={shortenAddress(policyInfo?.address, 19) || '-'} />
                            <RowItem lable={'Type'} value={policyInfo?.decision_policy['@type']} />
                        </Grid>
                        <Grid md={4}>
                            <RowItem lable={'Group Id'} value={policyInfo?.group_id} />
                            <RowItem lable={'Version'} value={policyInfo?.version} />
                            <RowItem lable={'Threshold'}
                                value={policyInfo?.decision_policy?.threshold} />
                            <RowItem lable={'Voting Period'}
                                value={`${parseFloat(policyInfo?.decision_policy?.windows?.voting_period).toFixed(2)} s`} />
                            <RowItem lable={'Mininum Exectuion Period'}
                                value={`${parseFloat(policyInfo?.decision_policy?.windows?.min_execution_period).toFixed(2)} s`} />
                        </Grid>
                    </Grid>
                </Item>
            }
            <CreateProposal policyInfo={policyInfo} />
            <AllProposals />
        </Box >
    )
}

export default Policy