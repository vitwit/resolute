import { Alert, Button, Card, Chip, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import VotesTable from '../../components/group/VotesTable';
import RowItem from '../../components/group/RowItem';
import { getGroupProposalById, getVotesProposalById, txGroupProposalExecute, txGroupProposalVote } from '../../features/group/groupSlice';
import { proposalStatus, shortenAddress } from '../../utils/util';
import AlertMsg from '../../components/group/AlertMsg';
import { getLocalTime } from '../../utils/datetime';
import DailogVote from '../../components/group/DialogVote';

const ProposalInfo = ({ id, wallet }) => {
    const [voteOpen, setVoteOpen] = useState(false);

    const dispatch = useDispatch();
    const proposalInfo = useSelector(state => state.group.groupProposal);
    const voteRes = useSelector(state => state.group?.voteRes);

    const { data: { proposal } = {} } = proposalInfo;

    const getProposal = () => {
        dispatch(getGroupProposalById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id
        }))
    }

    useEffect(() => {
        getProposal();
    }, [])

    useEffect(() => {
        if (voteRes?.status === 'idle')
            setVoteOpen(false);
    }, [voteRes?.status])

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
        <Grid Containter>
            <DailogVote
                proposalId={proposal?.id}
                voteRes={voteRes}
                selectedValue={'yes here'}
                onClose={onVoteDailogClose}
                onConfirm={onConfirm}
                open={voteOpen}
            />
            {
                proposalInfo?.status === 'pending' ?
                    <CircularProgress /> : null
            }
            {
                (proposalInfo?.status === 'idle' &&
                    !proposal) ?
                    <AlertMsg type='error'
                        text='Proposal not found' /> : null
            }

            {
                proposalInfo?.status === 'idle' ?
                    <Box sx={{ p: 4, mb: 3 }}>
                        <Box width={'100%'} component={'div'}>
                            <Chip
                                sx={{ float: 'left', fontSize: 16, mb: 3 }}
                                variant='outlined'
                                label={proposal?.status?.split('_').join('  ')} color='primary' />
                        </Box>

                        <Box sx={{ width: '100%', mt: 8, textAlign: 'left' }} component={'div'}>
                            <Typography gutterBottom textAlign={'left'} variant='h5'>
                                # {proposal?.metadata || '-'}
                            </Typography>
                        </Box>
                        <Grid container>
                            <Grid md={9} container>
                                <Grid md={6}>
                                    <Typography textAlign={'left'} variant='subtitle1'>
                                        Submit Time
                                    </Typography>
                                    <Typography textAlign={'left'} fontWeight={'bold'} variant='subtitle1'>
                                        {getLocalTime(proposal?.submit_time)}
                                    </Typography>
                                </Grid>

                                <Grid md={6}>
                                    <Typography textAlign={'left'} variant='subtitle1'>
                                        Voting Ends
                                    </Typography>
                                    <Typography textAlign={'left'} fontWeight={'bold'} variant='subtitle1'>
                                        {getLocalTime(proposal?.voting_period_end)}
                                    </Typography>
                                </Grid>

                                <Grid mt={2} md={6}>
                                    <Typography textAlign={'left'} variant='subtitle1'>
                                        Group Policy Address
                                    </Typography>
                                    <Typography textAlign={'left'} fontWeight={'bold'} variant='subtitle1'>
                                        {shortenAddress(proposal?.group_policy_address, 21)}
                                    </Typography>
                                </Grid>

                                <Grid mt={2} md={6}>
                                    <Typography textAlign={'left'} variant='subtitle1'>
                                        Proposers
                                    </Typography>
                                    <Box>
                                        {
                                            proposal?.proposers?.map(p => (
                                                <>
                                                    <Typography textAlign={'left'}
                                                        fontWeight={'bold'} variant='subtitle1'>
                                                        {shortenAddress(p, 21)}
                                                    </Typography>
                                                    <br />
                                                </>
                                            ))
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid md={3}>
                                {
                                    proposal?.status === 'PROPOSAL_STATUS_SUBMITTED' ?
                                        <Button
                                            sx={{ width: '50%', p: 2 }}
                                            variant='outlined'
                                            onClick={() => setVoteOpen(true)}
                                        >Vote</Button>
                                        : null
                                }

                                {
                                    proposal?.status === 'PROPOSAL_STATUS_ACCEPTED' ?
                                        <Button
                                            sx={{ width: '50%', p: 2 }}
                                            variant='outlined'
                                            onClick={() => onExecute(proposal?.id)}
                                        >
                                            Execute
                                        </Button>
                                        : null
                                }
                            </Grid>
                        </Grid>


                        <Paper sx={{ p: 3 }} variant='outlined'>
                            <Typography
                                sx={{ float: 'left' }}
                                textAlign={'left'}
                                variant='p'
                            >Vote Details</Typography><br /><br />
                            <Grid spacing={2} columnSpacing={{ md: 4 }} container>
                                <Grid item md={2}>
                                    <Paper sx={{ p: 1, borderColor: 'blue' }}
                                        variant='outlined'>
                                        <Typography
                                            color={'primary'}
                                            variant='subtitle1'
                                        >Yes</Typography>
                                        <Typography
                                            color={'primary'}
                                            fontWeight={'bold'}
                                            variant='subtitle1'
                                        >
                                            {proposal?.final_tally_result?.yes_count || 0}
                                        </Typography>
                                    </Paper>

                                </Grid>
                                <Grid item md={2}>
                                    <Paper sx={{ p: 1, borderColor: 'red' }} variant='outlined'>
                                        <Typography
                                            color={'error'}
                                            variant='subtitle1'
                                        >No</Typography>
                                        <Typography
                                            color={'error'}
                                            fontWeight={'bold'}
                                            variant='subtitle1'
                                        >
                                            {proposal?.final_tally_result?.no_count || 0}
                                        </Typography>
                                    </Paper>

                                </Grid>
                                <Grid item md={2}>
                                    <Paper sx={{ p: 1, borderColor: 'orange' }} variant='outlined'>
                                        <Typography
                                            color={'orange'}
                                            variant='subtitle1'
                                        >Abstain</Typography>
                                        <Typography color={'orange'}
                                            fontWeight={'bold'}
                                            variant='subtitle1'>
                                            {proposal?.final_tally_result?.abstain_count || 0}
                                        </Typography>
                                    </Paper>

                                </Grid>
                                <Grid item md={2}>
                                    <Paper sx={{ p: 1, borderColor: 'black' }} variant='outlined'>
                                        <Typography>Veto</Typography>
                                        <Typography
                                            color={'black'}
                                            fontWeight={'bold'}
                                            variant='subtitle1'
                                        >{proposal?.final_tally_result?.no_with_veto_account || 0}</Typography>
                                    </Paper>

                                </Grid>
                            </Grid>
                        </Paper>

                        <Grid mt={4}>
                            <Typography
                                textAlign={'left'}
                                gutterBottom variant='h5'>Messages</Typography>

                            {
                                proposal?.messages?.map(p => (
                                    <Box sx={{ p: 3 }}>
                                        {
                                            p['@type'] === '/cosmos.bank.v1beta1.MsgSend' ?
                                                <Card sx={{ p: 3 }}>
                                                    <Typography sx={{ fontSize: 18, textAlign: 'left' }}>
                                                        <strong>Send</strong> &nbsp;
                                                        {p?.amount?.[0]?.amount}  &nbsp;
                                                        {p?.amount?.[0]?.denom}  &nbsp;
                                                        <strong> to </strong>  &nbsp;
                                                        {p?.to_address}
                                                    </Typography></Card> : null
                                        }
                                        {
                                            p['@type'] === '/cosmos.staking.v1beta1.MsgDelegate' ?
                                                <Card sx={{ p: 3 }}>
                                                    <Typography sx={{ fontSize: 18, textAlign: 'left' }}>
                                                        <strong>Delegate</strong> &nbsp;
                                                        {p?.amount?.amount}  &?.[0]nbsp;
                                                        {p?.amount?.denom}  &nbsp;
                                                        <strong> to </strong>  &nbsp;
                                                        {p?.validator_address}
                                                    </Typography></Card> : null
                                        }
                                    </Box>
                                ))
                            }
                        </Grid>

                    </Box> : null
            }
        </Grid>
    )
}

function Proposal() {
    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const wallet = useSelector(state => state.wallet);
    const voteRes = useSelector(state => state.group?.voteRes);

    const fetchVotes = (baseURL, id, limit, key) => {
        dispatch(getVotesProposalById({
            baseURL: baseURL,
            id: id,
            pagination: { limit: limit, key: key },
        }))
    }

    useEffect(() => {
        if (voteRes?.status === 'idle')
            fetchVotes(wallet?.chainInfo?.config?.rest, id, limit, '')
    }, [voteRes?.status])

    useEffect(() => {
        fetchVotes(wallet?.chainInfo?.config?.rest, id, limit, '')
    }, [])

    const handleMembersPagination = (number, limit, key) => {
        setLimit(limit);
        setPageNumber(number);
        fetchVotes(wallet?.chainInfo?.config?.rest, id, limit, key)
    }

    const groupInfo = useSelector(state => state.group.proposalVotes);
    const { data, status } = groupInfo;

    useEffect(() => {
        if (Number(data?.pagination?.total))
            setTotal(Number(data?.pagination?.total || 0))
    }, [data])

    return (
        <Box>
            <Box>
                <Paper>
                    <Box>
                        <ProposalInfo id={id} wallet={wallet} />
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Paper>
                    {
                        status === 'pending' ?
                            <CircularProgress /> : null
                    }

                    {
                        status !== 'pending' ?
                            <VotesTable
                                total={total}
                                limit={limit}
                                pageNumber={pageNumber}
                                handleMembersPagination={handleMembersPagination}
                                rows={data} />

                            : null}
                </Paper>
            </Box>
        </Box>
    )
}

export default Proposal