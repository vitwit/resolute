import {
    Box, Button, TextField, Select, MenuItem, FormControlLabel, Switch, Typography, Grid, FormControl, InputLabel, InputAdornment,
} from '@mui/material';
import React, { useState } from 'react'
import { Interface } from 'readline';
import Policy from '../../pages/group/Policy';
import { gpStyles } from './groupCmpStyles';

interface PolicyFormProps {
    handlePolicy: any,
    handlePolicyClose: any
    policyObj?: any
}

function PolicyForm({ handlePolicy, policyObj, handlePolicyClose }: PolicyFormProps) {

    var policyInitialObj = {
        metadata: '',
        decisionPolicy: '',
        threshold: 0,
        percentage: 0,
        votingPeriod: 0,
        minExecPeriod: 0
    };

    if (policyObj) {
        policyInitialObj = {
            metadata: policyObj?.metadata,
            decisionPolicy: policyObj?.decision_policy?.['@type'] === '/cosmos.group.v1.ThresholdDecisionPolicy' ?
                'threshold' : 'percentage',
            threshold: Number(policyObj?.decision_policy?.threshold || 0),
            percentage: Number(policyObj?.decision_policy?.percentage || 0),
            votingPeriod: parseFloat(policyObj?.decision_policy?.windows?.voting_period || 0),
            minExecPeriod: parseFloat(policyObj?.decision_policy?.windows?.min_execution_period || 0)
        }
    }

    var [policy, setPolicy] = useState(policyInitialObj);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        policy = {
            ...policy,
            [e.target.name]: e.target.value
        };
        if (e.target.name === 'decisionPolicy') {
            if (e.target.value === 'percentage') {
                policy = {
                    ...policy,
                    threshold: 0,
                };
            } else if (e.target.value === 'threshold') {
                policy = { ...policy, percentage: 0 }
            }
        }
        setPolicy({ ...policy })
    }

    const handleSelectChange = (value: string) => {
        policy = {
            ...policy,
            decisionPolicy: value
        }
        setPolicy({ ...policy })
    }

    const handlePolicySubmit = () => {
        handlePolicy(policy)
    }

    return (
        <Box sx={gpStyles.policy_box}>
            <Box sx={gpStyles.flex_center}>
                <Typography
                    sx={gpStyles.f_22}>Add Decision Policy</Typography>
            </Box>
            <br />
            <Box>
                <TextField
                    fullWidth
                    name='metadata'
                    placeholder='Policy Metadata*'
                    value={policy.metadata}
                    required
                    onChange={handleChange}
                />
                <Grid container spacing={2}>
                    <Grid item sx={{ mt: 1.5 }} md={6} xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="decision-policy">Decision Policy*</InputLabel>
                            <Select
                                labelId="Decision Policy*"
                                id="decision-policy"
                                value={policy.decisionPolicy}
                                label="Decision Policy*"
                                name='decisionPolicy'
                                onChange={(e) => {
                                    handleSelectChange(e.target.value)
                                }}
                            >
                                <MenuItem value={'threshold'}>Threshold</MenuItem>
                                <MenuItem value={'percentage'}>Percentage</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={5}>
                        {
                            policy?.decisionPolicy === 'percentage' ?
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        onChange={handleChange}
                                        sx={{ float: 'right', textAlign: 'right' }}
                                        name='percentage'
                                        value={policy.percentage}
                                        type='number'
                                        placeholder='Percentage'
                                    />
                                </FormControl>
                                :
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        onChange={handleChange}
                                        name='threshold'
                                        value={policy.threshold}
                                        type='number'
                                        placeholder='Threshold'
                                    />
                                </FormControl>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                name='votingPeriod'
                                value={policy.votingPeriod}
                                type='number'
                                onChange={handleChange}
                                placeholder='Voting Period*'
                                InputProps={{
                                    endAdornment: <InputAdornment position="start"> Sec</InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                name='minExecPeriod'
                                value={policy?.minExecPeriod}
                                type='number'
                                onChange={handleChange}
                                placeholder='Min Exection Period*'
                                InputProps={{
                                    endAdornment: <InputAdornment position="start"> Sec</InputAdornment>,
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <FormControlLabel
                    name="policyAsAdmin"
                    control={
                        <Switch onChange={handleChange} name="policyAsAdmin" />
                    }
                    label="Group policy as admin"
                    labelPlacement="start"
                />
                <Typography>
                    if set to true, the group policy account address will be used as
                    group and policy admin
                </Typography>
            </Box>
            <br />
            <Box>
                <Button
                    color='error'
                    onClick={() => handlePolicyClose()}
                    variant='outlined' sx={gpStyles.j_center}>
                    Cancel

                </Button>
                <Button
                    onClick={() => handlePolicySubmit()}
                    variant='outlined' sx={gpStyles.j_center}>
                    Add Policy
                </Button>
            </Box>
        </Box>
    )
}

export default PolicyForm