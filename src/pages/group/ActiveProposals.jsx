import { Box, CircularProgress, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AlertMsg from '../../components/group/AlertMsg';
import ProposalCard from '../../components/group/ProposalCard';
import { resetActiveProposals } from '../../features/common/commonSlice';
import { getGroupPoliciesById, getGroupPolicyProposals, getGroupPolicyProposalsByPage } from '../../features/group/groupSlice';

const limit = 100;

function ActiveProposals({ id, wallet }) {
    const dispatch = useDispatch();

    var [proposals, setProposals] = useState([]);

    const proposalsRes = useSelector(state => state.group?.policyProposals)
    console.log('proposa ---res', proposalsRes)

    const getProposalByAddress = () => {
        dispatch(getGroupPolicyProposalsByPage({
            baseURL: wallet?.chainInfo?.config?.rest,
            groupId: id,
        }))
    }

    useEffect(() => {
        getProposalByAddress();
    }, [])

    useEffect(() => {
        setProposals([])
        if (proposalsRes?.status === 'idle') {
            
            // let allProposals = proposalsRes?.data?.filter(p => p.status === 'PROPOSAL_STATUS_SUBMITTED')
            // let allProposals = proposalsRes?.data?.sort((a, b) => b.id - a.id)
            // proposals = [...proposals, ...allProposals]
            setProposals([...proposalsRes?.data])
        }

    }, [proposalsRes?.status])

    useEffect(() => {
        return () => {
            // setProposals([])
            dispatch(resetActiveProposals())
        }
    })

    return (
        <Box>
            <Grid component={'div'} columnSpacing={{ md: 2 }} container p={2}>
                {
                    !proposals?.length ?
                        <AlertMsg type='error' text='No Active proposals found' /> : null

                }

                {
                    proposalsRes?.status === 'pending' ?
                        <CircularProgress /> : null
                }

                {
                    proposals?.map(p => (
                        <Grid item md={6}>
                            <ProposalCard proposal={p} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    )
}

export default ActiveProposals