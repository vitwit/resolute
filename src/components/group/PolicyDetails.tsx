import { Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { getFormatDate, getLocalTime } from '../../utils/datetime';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import { ThresholdDecisionPolicy } from '../../utils/util';

interface GridItemProps {
    label: string;
    text: string;
    isEditMode?: boolean;
    handleUpdate: any;
    disabledSubmit?:any
}

interface TextProps {
    text: string;
    toolTip?: string;
}

const LabelText = ({ text }: TextProps) => <Typography
    fontSize={17}
    color={'GrayText'}
    textAlign={'left'}>{text}</Typography>

const LabelValue = ({ text, toolTip }: TextProps) =>
    <Tooltip
        arrow placement="top-start" followCursor title={toolTip || ''}>
        <Typography
            fontSize={18}
            textAlign={'left'}>{text} </Typography>
    </Tooltip>

const GridItemEdit = ({
    label,
    text,
    isEditMode,
    handleUpdate,
    disabledSubmit
}: GridItemProps) => {
    const [isEdit, setIsEdit] = useState(isEditMode);

    return (
        <>
            <Typography fontSize={19} color={'GrayText'} textAlign={'left'}>
                {label}
            </Typography>
            {
                isEdit ?
                    <EditTextField
                        placeholder='Admin Address'
                        value={text}
                        disableSubmit={disabledSubmit}
                        handleUpdate={handleUpdate}
                        hideShowEdit={() => setIsEdit(false)}
                    /> :
                    <Box display={'flex'}>
                        <Typography
                            fontSize={19}
                            textAlign={'left'}
                            fontWeight={'bold'}>
                            {text}
                        </Typography> &nbsp;&nbsp;&nbsp;
                        <EditIcon onClick={() => setIsEdit(true)} color='primary' />
                    </Box>
            }

        </>
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
    disableSubmit?: any
}

const EditTextField = ({
    placeholder,
    handleUpdate,
    disableSubmit,
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
                disabled={disableSubmit}
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
                            disableSubmit={updateMetadataRes?.status === 'pending'}
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
                <Grid md={6}>
                    <Box>
                        <GridItemEdit
                            handleUpdate={handleUpdateAdmin}
                            disabledSubmit={updatePolicyAdminRes?.status === 'pending'}
                            label='Admin'
                            isEditMode={isAdminEdit}
                            text={policyObj?.admin} />

                        <Typography sx={{ float: 'left' }} variant='caption'>
                            Note: Only admin can be update admin address.</Typography>
                    </Box>
                </Grid>
                <Grid md={4}>
                    <LabelText text='Type' />
                    <LabelValue text={policyObj?.decision_policy['@type']} />
                </Grid>
                <Grid md={2}>
                    {
                        policyObj?.decision_policy['@type'] === ThresholdDecisionPolicy ?
                            <>
                                <LabelText text='Threshold' />
                                <LabelValue text={policyObj?.decision_policy?.threshold || '0'} />
                            </>
                            :
                            <>
                                <LabelText text='Percentage' />
                                <LabelValue text={policyObj?.decision_policy?.percentage || '0'} />
                            </>
                    }
                </Grid>
            </Grid>
            <Grid mt={2} container>
                <Grid md={3}>
                    <LabelText text='Created At' />
                    <LabelValue text={getFormatDate(policyObj?.created_at)}
                        toolTip={getLocalTime(policyObj?.created_at)} />
                </Grid>
                <Grid md={2}>
                    <LabelText text='Group ID' />
                    <LabelValue text={policyObj?.group_id}
                        toolTip={policyObj?.group_id} />
                </Grid>
                <Grid md={1}>
                    <LabelText text='Version' />
                    <LabelValue text={policyObj?.version}
                        toolTip={policyObj?.version} />
                </Grid>
                <Grid md={2}>
                    <LabelText text='Voting Period' />
                    <LabelValue text={parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0).toFixed(2) + ' Sec'}
                        toolTip={parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0).toFixed(2)} />
                </Grid>
                <Grid md={3}>
                    <LabelText text='Min Execution Period' />
                    <LabelValue text={parseFloat(policyObj?.decision_policy?.windows?.min_execution_period).toFixed(2)+ ' Sec'}
                        toolTip={parseFloat(policyObj?.decision_policy?.windows?.min_execution_period).toFixed(2)} />
                </Grid>
            </Grid>
        </Box>
    )
}

export default PolicyDetails