import React, { useEffect, useState } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, CircularProgress, Table, TableCell, TableRow, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import RowItem from '../../components/group/RowItem';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getGroupById, getGroupMembersById, getGroupPoliciesById } from '../../features/group/groupSlice';
import GroupsIcon from '@mui/icons-material/Groups';
import MembersTable from '../../components/group/MembersTable';
import PolicyCard from '../../components/group/PolicyCard';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    boxShadow: 'none',
    border: '1px solid #908d8d',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const groupPolicies = [
    {
        "address": "cosmos1..",
        "group_id": "1",
        "admin": "cosmos1..",
        "metadata": "AQ==",
        "version": "1",
        "decision_policy": {
            "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",
            "threshold": "1",
            "windows": {
                "voting_period": "120h",
                "min_execution_period": "0s"
            }
        },
    },
    {
        "address": "cosmos1..",
        "group_id": "1",
        "admin": "cosmos1..",
        "metadata": "AQ==",
        "version": "1",
        "decision_policy": {
            "@type": "/cosmos.group.v1.ThresholdDecisionPolicy",
            "threshold": "1",
            "windows": {
                "voting_period": "120h",
                "min_execution_period": "0s"
            }
        },
    }
];

const members = [
    {
        "id": "1",
        "admin": "cosmos1..",
        "metadata": "AQ==",
        "version": "1",
        "total_weight": "3"
    },
    {
        "id": "2",
        "admin": "cosmos1..",
        "metadata": "AQ==",
        "version": "1",
        "total_weight": "3"
    }
];

const GroupPolicies = ({ id, wallet }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        dispatch(getGroupPoliciesById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: { limit: limit, key: '' },
        }))
    }, [])

    const handlePagination = (number, limit, key) => {
        setLimit(limit);
        setPageNumber(number);
        dispatch(getGroupMembersById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: { limit: limit, key: key },
        }))
    }
    let group_policies = [];
    const groupInfo = useSelector(state => state.group.groupPolicies);
    const { data , status } = groupInfo;

    if (data) {
        group_policies = data?.group_policies;
    }


    // const {
    //     group_policies = []
    // } = data;

    useEffect(() => {
        if (Number(data?.pagination?.total))
            setTotal(Number(data?.pagination?.total || 0))
    }, [data])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontSize: 24, mt: 2 }}>Group Policies</Typography><br />
            <Grid container spacing={{ xs: 2, md: 1 }}
                columns={{ xs: 4, sm: 8, md: 10 }}>
                {
                    status === 'pending' ?
                        <CircularProgress /> : null
                }
                { status !== 'pending' && group_policies.map((p, index) => (
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

    useEffect(() => {
        dispatch(getGroupMembersById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: { limit: limit, key: '' },
        }))
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

    useEffect(() => {
        dispatch(getGroupById({
            baseURL: wallet?.chainInfo?.config?.rest, id: id
        }))
    }, [])

    const groupInfo = useSelector(state => state.group.groupInfo);
    const { data, status } = groupInfo;

    return (
        <Box>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Grid container>
                    <Grid md={3}>
                        <GroupsIcon sx={{ fontSize: 95, color: '#666' }} />
                        <Typography sx={{ fontSize: 34 }}># {data?.info?.id}    </Typography>
                    </Grid>
                    <Grid md={9}>
                        {
                            status === 'pending' ?
                                <CircularProgress /> : null
                        }
                        {
                            status !== 'pending' ?
                                <Box>

                                    <RowItem lable={'Admin'} value={data?.info?.admin || '-'} />
                                    <RowItem lable={'Metadata'} value={data?.info?.metadata || '-'} />
                                    <RowItem lable={'Version'} value={data?.info?.version || '-'} />
                                    <RowItem lable={'Total Weight'} value={data?.info?.total_weight || '-'} />
                                </Box> : null
                        }

                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

function Group() {
    const params = useParams();

    const wallet = useSelector(state => state.wallet)
    return (
        <Box>
            <GroupInfo id={params?.id} wallet={wallet} />
            <GroupMembers id={params?.id} wallet={wallet} />
            <GroupPolicies id={params?.id} wallet={wallet} />
        </Box>
    )
}

export default Group