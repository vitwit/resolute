import { Grid, IconButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { getLocalTime } from '../../utils/datetime';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import { ThresholdDecisionPolicy } from '../../utils/util';

interface GridItemProps {
    label: string;
    text: string;
    isEditMode?: boolean;
    handleUpdate: any
}

const GridItemEdit = ({
    label,
    text,
    isEditMode,
    handleUpdate
}: GridItemProps) => {
    const [isEdit, setIsEdit] = useState(isEditMode);

    return (
        <Grid container>
            <Grid md={2}>
                <Typography textAlign={'left'}>
                    {label}
                </Typography>
            </Grid>
            <Grid container md={10}>
                {
                    isEdit ?
                        <EditTextField
                            placeholder='Admin Address'
                            value={text}
                            handleUpdate={handleUpdate}
                            hideShowEdit={() => setIsEdit(false)}
                        /> :
                        <>
                            <Typography fontWeight={'bold'}>
                                {text}
                            </Typography> &nbsp;&nbsp;&nbsp;
                            <EditIcon onClick={() => setIsEdit(true)} color='primary' />
                        </>
                }
            </Grid>

        </Grid>
    )
}

interface GridItemTextProps {
    label: string;
    text: string;
    isEditMode?: boolean;
    isEqualColumn?: boolean
}

const GridItemText = ({
    label,
    text,
    isEqualColumn
}: GridItemTextProps) => {
    return (
        <Grid container mt={1}>
            <Grid md={isEqualColumn ? 6 : 2}>
                <Typography textAlign={'left'}>
                    {label}
                </Typography>
            </Grid>
            <Grid container md={isEqualColumn ? 6 : 10}>
                <Typography textAlign={'left'} fontWeight={'bold'}>
                    {text}
                </Typography>
            </Grid>
        </Grid>
    )
}

interface EditTextFieldProps {
    name?: string;
    value: string;
    hideShowEdit?: any;
    placeholder?: string
    handleUpdate?: any;
}

const EditTextField = ({
    placeholder,
    handleUpdate,
    name, value, hideShowEdit,
}: EditTextFieldProps) => {
    const [field, setField] = useState(value);

    return (
        <Box sx={{ display: 'flex', width: '80%' }}>
            <TextField
                placeholder={placeholder}
                multiline
                onChange={(e) => setField(e.target.value)}
                value={field} fullWidth />

            <IconButton
                onClick={() => handleUpdate(field)}
                color='primary'
                sx={{ border: '1px solid', borderRadius: 2, ml: 2 }}
            >
                <CheckIcon color='primary' />
            </IconButton>
            <IconButton
                color='error'
                onClick={() => hideShowEdit()}
                sx={{ border: '1px solid', borderRadius: 2, ml: 2 }}>
                <CancelIcon color='error' />
            </IconButton>
        </Box>
    )
}

interface PolicyDetailsProps {
    policyObj: any,
    handleUpdateAdmin: any,
    handleUpdateMetadata: any
}

function PolicyDetails({
    policyObj,
    handleUpdateMetadata,
    handleUpdateAdmin }: PolicyDetailsProps) {
    const [isMetaEditMode, setIsMetaEditMode] = useState(false);
    const [isAdminEdit, setIsAdminEdit] = useState(false);

    const updateMetadataRes = useSelector((state: any) => state?.group?.updateGroupMetadataRes);

    useEffect(() => {
        if (updateMetadataRes?.status === 'idle') {
            setIsMetaEditMode(false);
        }
    }, [updateMetadataRes?.status])

    const updatePolicyAdminRes = useSelector((state: any) => state?.group?.updatePolicyAdminRes);

    useEffect(() => {
        if (updatePolicyAdminRes?.status === 'idle') {
            setIsAdminEdit(false);
        }
    }, [updatePolicyAdminRes?.status])

    return (
        <Box>
            <Box mt={7}>
                {
                    isMetaEditMode ?
                        <EditTextField
                            handleUpdate={handleUpdateMetadata}
                            placeholder='Metadata'
                            hideShowEdit={() => {
                                setIsMetaEditMode(false);
                            }}
                            value={policyObj?.metadata} />
                        :
                        <Typography
                            textAlign={'left'}
                            variant='h5'>
                            ## {policyObj?.metadata} &nbsp;&nbsp; &nbsp;
                            <EditIcon color={'primary'}
                                onClick={() => setIsMetaEditMode(true)} />
                        </Typography>
                }
            </Box>

            <Typography gutterBottom sx={{ float: 'left' }} variant='caption'>
                Note: Only admin can be update metadata.
            </Typography>

            <Grid container>
                <Grid item md={8}>
                    <Box mb={4}>
                        <GridItemEdit
                            handleUpdate={handleUpdateAdmin}
                            label='Admin'
                            isEditMode={isAdminEdit}
                            text={policyObj?.admin} />

                        <Typography sx={{ float: 'left' }} variant='caption'>
                            Note: Only admin can be update admin address.</Typography>
                    </Box>

                    <GridItemText
                        label='Type'
                        text={policyObj?.decision_policy['@type']}
                    />

                    {
                        policyObj?.decision_policy['@type'] === ThresholdDecisionPolicy ?
                            <GridItemText
                                label='Threshold'
                                text={`${policyObj?.decision_policy?.threshold || '0'}`}
                            /> :
                            <GridItemText
                                label='Percentage'
                                text={`${policyObj?.decision_policy?.percentage || '0'} %`} 
                            />
                    }

                    <GridItemText
                        label='Created At'
                        text={getLocalTime(policyObj?.created_at)}
                    />
                </Grid>
                <Grid md={4}>
                    <GridItemText
                        isEqualColumn={true}
                        label='Group Id'
                        text={policyObj?.group_id || '-'}
                    />

                    <GridItemText
                        isEqualColumn={true}
                        label='Version'
                        text={policyObj?.version || '-'}
                    />

                    <GridItemText
                        isEqualColumn={true}
                        label='Voting Period'
                        text={
                            `${parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0).toFixed(2)} s`
                            || '-'}
                    />

                    <GridItemText
                        isEqualColumn={true}
                        label='Min Execution Period'
                        text={
                            `${parseFloat(policyObj?.decision_policy?.windows?.min_execution_period).toFixed(2)} s`
                            || '-'}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default PolicyDetails