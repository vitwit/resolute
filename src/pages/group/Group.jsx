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
import GroupsIcon from '@mui/icons-material/Groups';
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
            <Typography sx={{ fontSize: 24, mt: 2 }}>Group Policies</Typography><br />

            <Box>
                <Button
                    variant="outlined"
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


            <Grid container spacing={{ xs: 2, md: 1 }}
                columns={{ xs: 4, sm: 8, md: 10 }}>
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
                    <PolicyCard obj={p} />
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
                        pageNumber={pageNumber}
                        handleMembersPagination={handleMembersPagination}
                        rows={data} />

                    : null}
        </Box>
    )
}

const GroupInfo = ({ id, wallet }) => {
    const dispatch = useDispatch();
    const [showAdminInput, setShowAdminInput] = useState(false);
    const [admin, setAdmin] = useState('');
    const [metadata, setMetadata] = useState('');
    const [showMetadataInput, setShowMetadataInput] = useState(false);

    const groupMembers = useSelector(state => state.group.groupMembers)
    const { data: members, status: memberStatus } = groupMembers;


    const isExistInGroup = () => {
        const existMember = members?.members?.filter(m => m?.member?.address === wallet?.address)

        if (existMember && existMember?.length) {
            return true
        }
        return false;
    }

    useEffect(() => {
        dispatch(getGroupById({
            baseURL: wallet?.chainInfo?.config?.rest, id: id
        }))
    }, [])

    const groupInfo = useSelector(state => state.group.groupInfo);
    const { data, status } = groupInfo;
    const leaveGroupRes = useSelector(state => state.group.leaveGroupRes)

    const handleLeaveGroup = () => {
        const chainInfo = wallet?.chainInfo;
        dispatch(txLeaveGroupMember({
            admin: wallet?.address,
            groupId: id,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }));
    }

    const UpdateAdmin = () => {
        const chainInfo = wallet?.chainInfo;
        dispatch(txUpdateGroupAdmin({
            admin: data?.info?.admin,
            groupId: id,
            newAdmin: admin,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }));
    }

    const UpdateMetadata = () => {
        const chainInfo = wallet?.chainInfo;
        dispatch(txUpdateGroupMetadata({
            admin: data?.info?.admin,
            groupId: id,
            metadata,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }));
    }

    return (
        <Box>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Grid container>
                    <Grid md={3}>
                        <GroupsIcon
                            color={'primary'}
                            sx={{ fontSize: 95 }} />
                        <Typography sx={{ fontSize: 34 }}>
                            # {data?.info?.id}
                        </Typography>
                        {
                            memberStatus?.status === 'pending' ?
                                <CircularProgress /> : null
                        }
                        {
                            memberStatus?.status !== 'pending' && isExistInGroup() ?
                                <Button
                                    color={'error'}
                                    onClick={() => handleLeaveGroup()}
                                    variant={'outlined'}>
                                    {
                                        leaveGroupRes?.status === 'pending' ?
                                            'Loading...' : 'Leave Group'
                                    }
                                </Button> : null
                        }

                    </Grid>
                    <Grid md={9}>
                        {
                            status === 'pending' ?
                                <CircularProgress /> : null
                        }
                        {
                            status !== 'pending' ?
                                <Box>
                                    <Grid container>
                                        <Grid md={2}>
                                            <Typography sx={{
                                                fontSize: 18,
                                                textAlign: 'left',
                                                ml: 1
                                            }}>Admin</Typography>
                                        </Grid>
                                        <Grid md={6}>
                                            {
                                                showAdminInput ?
                                                    <TextField
                                                        fullWidth
                                                        value={admin}
                                                        onChange={e => {
                                                            setAdmin(e.target.value)
                                                        }}
                                                    />
                                                    :
                                                    <>
                                                        <Typography sx={{
                                                            fontSize: 18,
                                                            textAlign: 'left',
                                                            fontWeight: 'bold',
                                                            ml: 2
                                                        }}>
                                                            {data?.info?.admin || '-'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            ml: 2,
                                                            textAlign: 'left'
                                                        }}>
                                                            Note: Only admin can be update admin address.
                                                        </Typography>
                                                    </>
                                            }

                                        </Grid>
                                        <Grid sx={{ textAlign: 'left', ml: 1 }} md={2}>
                                            {
                                                showAdminInput ?
                                                    <Box>
                                                        <IconButton
                                                            onClick={
                                                                () => UpdateAdmin()
                                                            }
                                                            color="primary">
                                                            <CheckIcon
                                                                sx={{ fontSize: 32 }}
                                                            />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={
                                                                () => setShowAdminInput(false)
                                                            }
                                                            color="error">
                                                            <CancelIcon
                                                                sx={{ fontSize: 32 }}
                                                            />
                                                        </IconButton>
                                                    </Box> :
                                                    <EditIcon onClick={
                                                        () => {
                                                            setAdmin(data?.info?.admin)
                                                            setShowAdminInput(!showAdminInput)
                                                        }
                                                    } />
                                            }

                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container>
                                        <Grid md={2}>
                                            <Typography sx={{
                                                fontSize: 18,
                                                textAlign: 'left',
                                                ml: 1
                                            }}>Metdata</Typography>
                                        </Grid>
                                        <Grid md={6}>
                                            {
                                                showMetadataInput ?
                                                    <TextField
                                                        fullWidth
                                                        value={metadata}
                                                        onChange={e => {
                                                            setMetadata(e.target.value)
                                                        }}
                                                    />
                                                    :
                                                    <>
                                                        <Typography sx={{
                                                            fontSize: 18,
                                                            textAlign: 'left',
                                                            fontWeight: 'bold',
                                                            ml: 2
                                                        }}>
                                                            {data?.info?.metadata || '-'}
                                                        </Typography>
                                                        <Typography sx={{
                                                            ml: 2,
                                                            textAlign: 'left'
                                                        }}>
                                                            Note: Only admin can be update metadata.
                                                        </Typography>
                                                    </>
                                            }

                                        </Grid>
                                        <Grid sx={{ textAlign: 'left', ml: 1 }} md={2}>
                                            {
                                                showMetadataInput ?
                                                    <Box>
                                                        <IconButton
                                                            onClick={
                                                                () => UpdateMetadata()
                                                            }
                                                            color="primary">
                                                            <CheckIcon
                                                                sx={{ fontSize: 32 }}
                                                            />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={
                                                                () => setShowMetadataInput(false)
                                                            }
                                                            color="error">
                                                            <CancelIcon
                                                                sx={{ fontSize: 32 }}
                                                            />
                                                        </IconButton>
                                                    </Box> :
                                                    <EditIcon onClick={
                                                        () => {
                                                            setMetadata(data?.info?.metadata)
                                                            setShowMetadataInput(!showMetadataInput)
                                                        }
                                                    } />
                                            }

                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container>
                                        <Grid md={2}>
                                            <Typography sx={{
                                                fontSize: 18,
                                                textAlign: 'left',
                                                ml: 1
                                            }}>Version</Typography>
                                        </Grid>
                                        <Grid md={10}>
                                            <Typography sx={{
                                                fontSize: 18,
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                ml: 2
                                            }}>{data?.info?.version || '-'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid md={2}>
                                            <Typography sx={{
                                                fontSize: 18,
                                                textAlign: 'left',
                                                ml: 1
                                            }}>Weight</Typography>
                                        </Grid>
                                        <Grid md={10}>
                                            <Typography sx={{
                                                fontSize: 18,
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                ml: 2
                                            }}>{data?.info?.total_weight || '-'}</Typography>
                                        </Grid>
                                    </Grid>

                                </Box> : null
                        }

                    </Grid>
                </Grid>
            </Paper>
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

    // useEffect(() => {
    //     return () => {
    //         dispatch(resetUpdateGroupMember())
    //     }
    // }, [])

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
        console.log('allmembers ---- ', allMembers)
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
                    variant='outlined'>Update Member</Button>
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

    const wallet = useSelector(state => state.wallet)
    return (
        <Box>
            <GroupInfo id={params?.id} wallet={wallet} />
            <UpdateGroupMember id={params?.id} wallet={wallet} />
            <GroupMembers id={params?.id} wallet={wallet} />
            <GroupPolicies id={params?.id} wallet={wallet} />
        </Box>
    )
}

export default Group