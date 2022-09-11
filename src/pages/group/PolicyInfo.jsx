import {
    Button, Grid, TextField,
    Paper,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorage, shortenAddress } from '../../utils/util';
import { getGroupPoliciesById, txUpdateGroupPolicy, txUpdateGroupPolicyAdmin, txUpdateGroupPolicyMetdata } from '../../features/group/groupSlice';
import PolicyForm from '../../components/group/PolicyForm';
import EditIcon from '@mui/icons-material/Edit';
import RowItem from '../../components/group/RowItem';
import { useParams } from 'react-router-dom';
import AlertMsg from '../../components/group/AlertMsg';
import PolicyDetails from '../../components/group/PolicyDetails';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function PolicyInfo() {
    const [policyObj, setPolicyObj] = useState({});
    const [isEditPolicyForm, setEditPolicyForm] = useState(false);

    const dispatch = useDispatch();
    const { id, policyId } = useParams();

    const wallet = useSelector(state => state.wallet);
    const updateMetadataRes = useSelector(state => state.group.updateGroupMetadataRes);
    const updatePolicyAdminRes = useSelector(state => state.group.updatePolicyAdminRes);
    const updateGroupPolicyRes = useSelector(state => state.group.updateGroupPolicyRes);

    const groupPoliceis = useSelector(state => state?.group?.groupPolicies)

    const getPolicies = () => {
        dispatch(getGroupPoliciesById({
            baseURL: wallet?.chainInfo?.config?.rest,
            id: id,
            pagination: {
                key: '',
                limit: 100
            }
        }))
    }

    useEffect(() => {
        getPolicies();
    }, [])

    useEffect(() => {
        const data = groupPoliceis?.data?.group_policies || [];
        if (data?.length) {
            const pArr = data.filter(d => d.address === policyId)
            if (pArr?.length) {
                setPolicyObj(pArr[0]);
            }
        }
    }, [groupPoliceis?.status])

    useEffect(() => {
        if (updateMetadataRes?.status === 'idle')
            getPolicies();
    }, [updateMetadataRes?.status])

    useEffect(() => {
        if (updatePolicyAdminRes?.status === 'idle')
            getPolicies();
    }, [updatePolicyAdminRes?.status])

    useEffect(() => {
        if (updateGroupPolicyRes?.status === 'idle') {
            setEditPolicyForm(false);
            getPolicies();
        }
    }, [updateGroupPolicyRes?.status])


    const handlePolicyMetadata = (newMetadata) => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txUpdateGroupPolicyMetdata({
            admin: policyObj?.admin,
            groupPolicyAddress: policyObj?.address,
            metadata: newMetadata,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const handleUpdateAdmin = (newAdmin) => {
        const chainInfo = wallet?.chainInfo;

        dispatch(txUpdateGroupPolicyAdmin({
            admin: policyObj?.admin,
            groupPolicyAddress: policyObj?.address,
            newAdmin: newAdmin,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    const handleSubmitPolicy = (policyMetadata) => {
        const chainInfo = wallet?.chainInfo;

        console.log('handle policy metad-----', policyMetadata)

        dispatch(txUpdateGroupPolicy({
            admin: policyObj?.admin,
            groupPolicyAddress: policyObj?.address,
            policyMetadata: policyMetadata,
            denom: chainInfo?.config?.currencies?.[0]?.minimalCoinDenom,
            chainId: chainInfo.config.chainId,
            rpc: chainInfo.config.rpc,
            feeAmount: chainInfo.config.gasPriceStep.average,
        }))
    }

    return (
        <Box>
            <Typography
                gutterBottom
                variant='h5'> Policy Information </Typography>
            {
                groupPoliceis?.status === 'pending' ?
                    <Paper variant='outlined'>
                        <CircularProgress variant='h2' /> </Paper>
                    : null
            }
            {
                (groupPoliceis?.status === 'idle' &&
                    !policyObj?.address) && <AlertMsg
                    type='error'
                    text='Policy not found'
                />
            }

            {
                (groupPoliceis?.status === 'idle' &&
                    policyObj?.address) ?
                    <Paper variant='outlined' sx={{ p: 4 }} elevation={0}>
                        <Button
                            endIcon={
                                <PlayArrowIcon />
                            }
                            variant='contained'
                            onClick={() => setEditPolicyForm(true)}
                            sx={{ float: 'right', mb: 9 }}>
                            Update policy
                        </Button>

                        {
                            isEditPolicyForm ?
                                <PolicyForm
                                    policyObj={policyObj}
                                    handlePolicy={handleSubmitPolicy}
                                    handlePolicyClose={() => setEditPolicyForm(false)}
                                /> :
                                <PolicyDetails
                                    handleUpdateMetadata={handlePolicyMetadata}
                                    handleUpdateAdmin={handleUpdateAdmin}
                                    policyObj={policyObj} />
                        }


                    </Paper> : null
            }
        </Box >
    )
}

export default PolicyInfo