import { Alert, Card, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import VotesTable from '../../components/group/VotesTable';
import RowItem from '../../components/group/RowItem';
import { getGroupProposalById, getVotesProposalById } from '../../features/group/groupSlice';
import { proposalStatus } from '../../utils/util';

const ProposalInfo = ({ id, wallet }) => {

    const dispatch = useDispatch();
    const proposalInfo = useSelector(state => state.group.groupProposal);
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

    return (
        <Grid Containter>
            {
                proposalInfo?.status === 'pending' ?
                    <CircularProgress /> : null
            }
            {
                proposalInfo?.status !== 'pending' && (
                    <Grid sx={{ p: 3 }}>
                        <Grid container md={12} sx={{ textAlign: 'left' }}>
                            <Grid md={8}>
                                <Typography sx={{ fontSize: 28 }}># {id}</Typography>
                            </Grid>
                            <Grid md={2} sx={{ textAlign: 'right' }}>
                                <Typography sx={{
                                    fontSize: 20,
                                    borderRadius: 25,
                                    p: 1,
                                    textAlign: 'center',
                                    background: proposalStatus[proposal?.status]?.bgColor,
                                    color: proposalStatus[proposal?.status]?.textColor
                                }}>
                                    {proposalStatus[proposal?.status]?.label ||
                                        proposal?.status}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid md={12} sx={{ textAlign: 'left' }}>
                            <Typography sx={{ fontSize: 28 }}>## {
                                proposal?.metadata || '-'
                            }</Typography>
                        </Grid>
                        <Grid container sx={{ textAlign: 'left' }}>
                            <Grid md={4}>
                                <Typography sx={{
                                    fontSize: 18,
                                    ml: 1
                                }}>Proposers</Typography>
                            </Grid>
                            <Grid md={8}>
                                {
                                    proposal?.proposers?.map(p => (
                                        <Typography sx={{
                                            fontSize: 18,
                                            ml: 2,
                                            fontWeight: 'bold'
                                        }}>
                                            - {p}
                                        </Typography>
                                    ))
                                }
                            </Grid>
                        </Grid>
                        <RowItem lable={'Group Policy Address'} value={
                            proposal?.group_policy_address
                        } />
                        <RowItem lable={'Group Policy Version'} value={
                            proposal?.group_policy_version
                        } />
                        <RowItem lable={'Group Version'} value={
                            proposal?.group_version
                        } />
                        <RowItem lable={'Executor Result'} value={
                            proposal?.executor_result?.replace(/_/g, ' ')
                        } />
                        <RowItem lable={'Submit Time'} value={
                            new Date(proposal?.submit_time).toUTCString()
                        } />
                        <RowItem lable={'Voting End Time'} value={
                            new Date(proposal?.voting_period_end).toUTCString()
                        } />

                        <Box>
                            <Typography
                                sx={{
                                    m: 2,
                                    fontSize: 22,
                                    textAlign: 'left'
                                }}>
                                Messages</Typography>

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
                        </Box>
                    </Grid>
                )
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

    const fetchVotes = (baseURL, id, limit, key) => {
        dispatch(getVotesProposalById({
            baseURL: baseURL,
            id: id,
            pagination: { limit: limit, key: key },
        }))
    }

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
                <Typography sx={{ fontSize: 22, textAlign: 'left' }}>
                    Proposal Information
                </Typography>
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
                        (status !== 'pending' &&
                            !data?.length) && (
                            <Card sx={{ width: '100%', p: 5 }}>
                                <Alert sx={{ textAlign: 'center' }} severity='info'>
                                    No votes found.
                                </Alert>
                            </Card>
                        )
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