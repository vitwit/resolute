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
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


import { getGroupById, txLeaveGroupMember, txUpdateGroupAdmin, txUpdateGroupMetadata } from "../../features/group/groupSlice";
import { getFormatDate, getLocalTime } from "../../utils/datetime";


const LabelText = ({ text }) => <Typography
    fontSize={17}
    color={'GrayText'}
    textAlign={'left'}>{text}</Typography>
const LabelValue = ({ text, toolTip }) =>
    <Tooltip
        arrow placement="top-start" followCursor title={toolTip}>
        <Typography
            fontSize={18}
            textAlign={'left'}>{text} </Typography>
    </Tooltip>


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
                    {
                        status === 'pending' ?
                            <CircularProgress /> : null
                    }

                    {
                        status !== 'pending' ?
                            <Box sx={{ width: '100%' }}>

                                <Button sx={{ float: 'right' }}
                                    endIcon={
                                        <ExitToAppIcon />
                                    }
                                    color="error"
                                    onClick={() => handleLeaveGroup()}
                                    variant={'outlined'}>
                                    {
                                        leaveGroupRes?.status === 'pending' ?
                                            'Loading...' : 'Leave Group'
                                    }
                                </Button>
                                {
                                    !showMetadataInput ?
                                        <>
                                            <Typography p={2}
                                                textAlign={'left'}
                                                variant="h5" color={'primary'}>
                                                {data?.info?.metadata}
                                                &nbsp; &nbsp;&nbsp;
                                                {
                                                    isExistInGroup() ?
                                                        <Button variant="outlined"
                                                            size="small"
                                                            onClick={
                                                                () => {
                                                                    setMetadata(data?.info?.metadata)
                                                                    setShowMetadataInput(!showMetadataInput)
                                                                }
                                                            }
                                                            endIcon={<EditIcon />}>Edit</Button> : null
                                                }
                                            </Typography>
                                        </> : <>
                                            <TextField sx={{ mt: 2 }} name="groupMetadata"
                                                value={metadata}
                                                fullWidth
                                                label={'Group Metadata'}
                                                onChange={e => {
                                                    setMetadata(e.target.value)
                                                }}
                                            />
                                            <Box sx={{ float: 'right', mt: 2 }}>
                                                <Button size="small"
                                                    color="error"
                                                    sx={{ mr: 2 }}
                                                    onClick={
                                                        () => {
                                                            setShowMetadataInput(false)
                                                        }
                                                    }
                                                    variant="outlined">Cancel</Button>
                                                <Button size="small"
                                                    onClick={
                                                        () => UpdateMetadata()
                                                    }
                                                    disabled={updateMetadataRes?.status === 'pending'}
                                                    variant="outlined">
                                                    {
                                                        updateMetadataRes?.status === 'pending' ?
                                                            'Submitting...' : 'Update'
                                                    }
                                                </Button>

                                            </Box>
                                        </>
                                }

                                <Grid p={2} md={12} columnGap={0.5} container>
                                    <Grid md={5}>
                                        {
                                            showAdminInput ?
                                                <>
                                                    <TextField
                                                        fullWidth
                                                        value={admin}
                                                        onChange={e => {
                                                            setAdmin(e.target.value)
                                                        }}
                                                        label={'Admin'}
                                                    />
                                                    <br /><br />

                                                    <Button onClick={
                                                        () => UpdateAdmin()
                                                    } sx={{ float: 'right' }}
                                                        disabled={updateAdminRes?.status === 'pending'}
                                                        size="small" variant="outlined">
                                                        {updateAdminRes?.status === 'pending' ?
                                                            'Loading...'
                                                            : 'Update'}
                                                    </Button>
                                                    <Button onClick={() => setShowAdminInput(false)} sx={{ mr: 2, float: 'right' }}
                                                        color="error"
                                                        size="small" variant="outlined">
                                                        Cancel
                                                    </Button>
                                                </>

                                                : <>
                                                    <LabelText text='Admin' />
                                                    <Box style={{ display: 'flex' }}>
                                                        <LabelValue
                                                            toolTip={data?.info?.admin}
                                                            text={data?.info?.admin} />
                                                        &nbsp;&nbsp;
                                                        {
                                                            isExistInGroup() ?
                                                                <Button onClick={() => {
                                                                    setAdmin(data?.info?.admin)
                                                                    setShowAdminInput(true)
                                                                }} endIcon={
                                                                    <EditIcon />
                                                                } size="small" variant="outlined">Edit</Button> : null
                                                        }

                                                    </Box>

                                                    <Typography
                                                        sx={{ float: 'left' }}
                                                        variant="caption"
                                                    >
                                                        Note: Only admin can be update admin address.
                                                    </Typography>

                                                </>
                                        }

                                    </Grid>
                                    <Grid sx={{ ml: 3 }} md={2}>
                                        <LabelText text='ID' />
                                        <LabelValue
                                        toolTip={data?.info?.id}
                                        text={data?.info?.id} />
                                    </Grid>
                                    <Grid md={2}>
                                        <LabelText text='Total Weight' />
                                        <LabelValue 
                                        toolTip={data?.info?.total_weight}
                                        text={data?.info?.total_weight} />
                                    </Grid>
                                    <Grid md={2}>
                                        <LabelText text='Created At' />
                                        <LabelValue
                                            toolTip={getLocalTime(data?.info?.created_at)}
                                            text={getFormatDate(data?.info?.created_at)} />

                                    </Grid>
                                </Grid>
                            </Box> : null
                    }
                </Grid>
            </Paper>
        </Box>
    )
}

export default GroupInfo