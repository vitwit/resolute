import {
    Box, Button, CircularProgress, Grid, Paper,
    TextField,
    Typography, IconButton, Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GroupsIcon from '@mui/icons-material/Groups';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

import { getGroupById, txLeaveGroupMember, txUpdateGroupAdmin, txUpdateGroupMetadata } from "../../features/group/groupSlice";

const GroupInfo = ({ id, wallet }) => {
    const dispatch = useDispatch();
    const [showAdminInput, setShowAdminInput] = useState(false);
    const [admin, setAdmin] = useState('');
    const [metadata, setMetadata] = useState('');
    const [showMetadataInput, setShowMetadataInput] = useState(false);
    const [groupInformation, setGroupInformation] = useState({});

    const groupMembers = useSelector(state => state.group.groupMembers)
    const { data: members, status: memberStatus } = groupMembers;

    const groupInfo = useSelector(state => state.group.groupInfo);
    const { data, status } = groupInfo;

    const leaveGroupRes = useSelector(state => state.group.leaveGroupRes);
    const updateAdminRes = useSelector(state => state.group.updateGroupAdminRes);
    const updateMetadataRes = useSelector(state => state.group.updateGroupMetadataRes);


    const isExistInGroup = () => {
        const existMember = members?.members?.filter(m => m?.member?.address === wallet?.address)

        if (existMember && existMember?.length) return true

        if (groupInformation?.admin === wallet?.address) return true

        return false;
    }

    const getGroup = () => {
        dispatch(getGroupById({
            baseURL: wallet?.chainInfo?.config?.rest, id: id
        }))
    }

    useEffect(() => {
        getGroup();
    }, [])

    useEffect(() => {
        if (groupInfo?.status === 'idle') {
            setGroupInformation(groupInfo?.data?.info)
        }

    }, [groupInfo?.status])

    useEffect(() => {
        if (updateAdminRes?.status === 'idle') {
            setShowAdminInput(false);
            getGroup();
        }

    }, [updateAdminRes?.status])

    useEffect(() => {
        if (updateMetadataRes?.status === 'idle') {
            setShowMetadataInput(false);
            getGroup();
        }

    }, [updateMetadataRes?.status])


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
            signer: wallet?.address,
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
            signer: wallet?.address,
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
            <Paper elevation={0} sx={{ p: 2, mt: 2 }}>
                <Grid container>
                    <Grid md={3}>
                        <GroupsIcon
                            color={'primary'}
                            sx={{ fontSize: 95 }} />
                        <Typography variant="h4">
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
                                                        <Typography
                                                            sx={{
                                                                ml: 2,
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            Note: Only admin can be update admin address.
                                                        </Typography>
                                                    </>
                                            }

                                        </Grid>
                                        <Grid sx={{ textAlign: 'left', ml: 1 }} md={2}>
                                            {
                                                showAdminInput ?
                                                    updateAdminRes?.status === 'pending' ?
                                                        <CircularProgress /> :
                                                        <Box>

                                                            <Tooltip title={'Update'} arrow>
                                                                <IconButton
                                                                    sx={{ border: '1px solid' }}
                                                                    onClick={
                                                                        () => UpdateAdmin()
                                                                    }
                                                                    color="primary">
                                                                    <CheckIcon
                                                                        sx={{ fontSize: 32 }}
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={'Cancel'} arrow>
                                                                <IconButton
                                                                    onClick={
                                                                        () => setShowAdminInput(false)
                                                                    }
                                                                    color="error">
                                                                    <CancelIcon
                                                                        sx={{ fontSize: 32 }}
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>

                                                        </Box> :
                                                    isExistInGroup() ?
                                                        <Tooltip title={'Edit'} arrow>
                                                            <EditIcon
                                                                color='primary'
                                                                onClick={
                                                                    () => {
                                                                        setAdmin(data?.info?.admin)
                                                                        setShowAdminInput(!showAdminInput)
                                                                    }
                                                                } />
                                                        </Tooltip>
                                                        : null
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
                                                    updateMetadataRes?.status === 'pending' ?
                                                        <CircularProgress /> :
                                                        <Box>
                                                            <Tooltip title={'Update'} arrow>
                                                                <IconButton

                                                                    sx={{ border: '1px solid' }}
                                                                    onClick={
                                                                        () => UpdateMetadata()
                                                                    }
                                                                    color="primary">
                                                                    <CheckIcon
                                                                        sx={{ fontSize: 32 }}
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title={'Cancel'} arrow>
                                                                <IconButton
                                                                    onClick={
                                                                        () => setShowMetadataInput(false)
                                                                    }
                                                                    color="error">
                                                                    <CancelIcon
                                                                        sx={{ fontSize: 32 }}
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>

                                                        </Box> :
                                                    isExistInGroup() ?
                                                        <Tooltip title={'Update'} arrow>
                                                            <EditIcon color='primary' onClick={
                                                                () => {
                                                                    setMetadata(data?.info?.metadata)
                                                                    setShowMetadataInput(!showMetadataInput)
                                                                }
                                                            } />
                                                        </Tooltip>
                                                        : null


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

export default GroupInfo