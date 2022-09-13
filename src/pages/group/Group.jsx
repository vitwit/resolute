import React, { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Alert, Button, Card, CircularProgress, FormControl, IconButton, Table, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import RowItem from '../../components/group/RowItem';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getGroupById, getGroupMembers, getGroupMembersById, getGroupPoliciesById, resetUpdateGroupMember, txAddGroupPolicy, txLeaveGroupMember, txUpdateGroupAdmin, txUpdateGroupMember, txUpdateGroupMetadata, txUpdateGroupPolicy } from '../../features/group/groupSlice';

import MembersTable from '../../components/group/MembersTable';
import PolicyCard from '../../components/group/PolicyCard';
import CreateGroupForm from './CreateGroupForm';
import UpdateGroupMemberForm from '../../components/group/UpdateGroupMemberForm';
import CreateGroupPolicy from './CreateGroupPolicy';
import EditIcon from '@mui/icons-material/Edit';
import { UpdateGroupAdmin } from '../../txns/group/group';
import PolicyForm from '../../components/group/PolicyForm';
import { groupStyles } from './group-css';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import GroupTab, { TabPanel } from '../../components/group/GroupTab';
import GroupInfo from './GroupInfo';
import ActiveProposals from './ActiveProposals';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    boxShadow: 'none',
    border: '1px solid #908d8d',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const GroupPolicies = ({ id, wallet }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const groupDetails = useSelector(state => state.group.groupInfo);
    const { data: groupInformation, status: groupInfoStatus } = groupDetails;

    const addPolicyRes = useSelector(state => state.group.addGroupPolicyRes);

    useEffect(() => {
        getPolicies(limit, '')
        setShowForm(false);
    }, [addPolicyRes?.status])

    const getPolicies = (limit, key = '') => {
        dispatch(getGroupPoliciesById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: { limit: limit, key },
        }))
    }
    useEffect(() => {
        getPolicies(limit, '')
    }, [])

    const handlePagination = (number, limit, key) => {
        setLimit(limit);
        setPageNumber(number);
        getPolicies(limit, key)
    }
    let group_policies = [];
    const groupInfo = useSelector(state => state.group.groupPolicies);
    const { data, status } = groupInfo;

    if (data) {
        group_policies = data?.group_policies;
    }

    useEffect(() => {
        if (Number(data?.pagination?.total))
            setTotal(Number(data?.pagination?.total || 0))
    }, [data])

    const handlePolicy = (policyObj) => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txAddGroupPolicy({
            admin: groupInformation?.info?.admin,
            groupId: id,
            policyMetadata: policyObj,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box>
                <Button
                    variant="contained"
                    onClick={() => {
                        setShowForm(!showForm)
                    }}
                    sx={groupStyles.fr_mb_2}
                >
                    Add Decision Policy
                </Button>
            </Box>
            {
                showForm &&
                <Card sx={groupStyles.fw}>
                    <PolicyForm handlePolicyClose={
                        () => setShowForm(false)
                    } handlePolicy={handlePolicy} />
                </Card>
            }


            <Grid container
            >
                {
                    status === 'pending' ?
                        <CircularProgress /> : null
                }
                {
                    (status !== 'pending' &&
                        !showForm &&
                        !group_policies?.length) && (
                        <Card sx={{ width: '100%', p: 5 }}>
                            <Alert sx={{ textAlign: 'center' }} severity='info'>
                                No policies found.
                            </Alert>
                        </Card>
                    )
                }

                {status !== 'pending' && group_policies.map((p, index) => (
                    <Grid md={4} xs={1} sm={2} lg={4}>
                        <PolicyCard obj={p} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

const GroupMembers = ({ id, wallet }) => {
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    const createGroupRes = useSelector(state => state.group?.updateGroupRes)

    const getGroupmembers = () => {
        dispatch(getGroupMembersById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: { limit: limit, key: '' },
        }))
    }

    useEffect(() => {
        dispatch(resetUpdateGroupMember())
        getGroupmembers();
    }, [createGroupRes?.status])

    useEffect(() => {
        getGroupmembers();
    }, [])

    const handleMembersPagination = (number, limit, key) => {
        setLimit(limit);
        setPageNumber(number);
        dispatch(getGroupMembersById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: { limit: limit, key: key },
        }))
    }

    const groupInfo = useSelector(state => state.group.groupMembers);
    const { data, status } = groupInfo;

    useEffect(() => {
        if (Number(data?.pagination?.total))
            setTotal(Number(data?.pagination?.total || 0))
    }, [data])

    const handleDeleteMember = (deleteMemberObj) => {
        const chainInfo = wallet?.chainInfo;

        const dataObj = {
            admin: wallet?.address,
            groupId: id,
            members: [deleteMemberObj],
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }

        dispatch(txUpdateGroupMember(dataObj))
    }

    return (
        <Box sx={{ flexGrow: 1, mt: 2 }}>
            {
                status === 'pending' ?
                    <CircularProgress /> : null
            }
            {
                status !== 'pending' ?
                    <MembersTable
                        total={total}
                        limit={limit}
                        handleDeleteMember={handleDeleteMember}
                        pageNumber={pageNumber}
                        handleMembersPagination={handleMembersPagination}
                        rows={data} />

                    : null}
        </Box>
    )
}



const UpdateGroupMember = ({ id, wallet }) => {
    const [showForm, setShowForm] = useState(false);
    var [members2, setMembers] = useState([]);
    const dispatch = useDispatch();
    const updateRes = useSelector(state => state.group.updateGroupRes)

    useEffect(() => {
        if (updateRes?.status === 'idle') {
            setShowForm(false);
        }
    }, [updateRes])

    useEffect(() => {
        return () => {
            dispatch(resetUpdateGroupMember())
        }
    }, [])

    const groupMembers = useSelector(state => state.group.groupMembers)
    const members1 = [{ address: '', weight: '', metadata: '' }];
    const { data: members, status: memberStatus } = groupMembers;

    const getMembers = () => {
        let m = members && members?.members?.map(m => {
            let { added_at, ...newObj } = m?.member;
            return newObj
        })
        if (m?.length)
            setMembers([...m])
        else
            setMembers([...members2, members1]);
    }

    // useEffect(() => {
    //     if (updateRes?.status === 'idle')
    //         getGroupMembers()
    // }, [updateRes?.status])

    useEffect(() => {
        getMembers()
    }, [])

    const handleMembers = (membersArr) => {
        members2 = membersArr;
        setMembers([...members2]);
    }

    const handleUpdate = (allMembers) => {
        const chainInfo = wallet?.chainInfo;

        const dataObj = {
            admin: wallet?.address,
            groupId: id,
            members: allMembers,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }

        dispatch(txUpdateGroupMember(dataObj))
    }

    return (
        <Box>
            <br />
            <Box sx={{ float: 'right' }}>
                <Button onClick={() => setShowForm(!showForm)}
                    variant='contained'>Update Member</Button>
            </Box><br /><br /><br />
            <Box>
                {
                    showForm ?

                        <Paper>
                            <Box sx={{ ml: 4 }}>
                                <br />
                                <Typography sx={{ fontSize: 20 }}>
                                    Update Group Members
                                </Typography>
                                <UpdateGroupMemberForm
                                    handleUpdate={handleUpdate}
                                    members={members2}
                                />

                            </Box>
                        </Paper>
                        : null
                }
            </Box>

        </Box >
    )
}

function Group() {
    const params = useParams();
    const [tabIndex, setTabIndex] = useState(0);

    const wallet = useSelector(state => state.wallet)
    const arr = ['Members', 'Decision Policies', 'Active Proposals']

    return (
        <Box>
            <GroupInfo id={params?.id} wallet={wallet} />

            <Paper sx={{ mt: 2 }} elevation={0} >
                <GroupTab tabs={arr} handleTabChange={(i) => setTabIndex(i)} />
                <TabPanel value={tabIndex} index={0}>
                    <UpdateGroupMember id={params?.id} wallet={wallet} />
                    <GroupMembers id={params?.id} wallet={wallet} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1} >
                    <GroupPolicies id={params?.id} wallet={wallet} />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <ActiveProposals id={params?.id} wallet={wallet}/>
                </TabPanel>
            </Paper>
        </Box>
    )
}

export default Group