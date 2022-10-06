import {
    Box, Button, TextField, Select, MenuItem, FormControlLabel, Switch, Typography, Grid, FormControl, InputLabel, InputAdornment, Paper,
} from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Controller } from "react-hook-form";

function CreateGroupPolicy({
    control,
    register,
    watch,
    fields,
    errors,
    reset,
    setValue,
    handleCancelPolicy }) {

    // setValue('policyMetadata.votingPeriodDuration', 'Minutes')

    return (
        <Paper sx={{ p: 2, mt: 3 }} variant='outlined' elevation={0} >
            <Box sx={{ display: 'flex', m: 2, justifyContent: 'center' }}>
                <Typography gutterBottom variant='subtitle1'>
                    <strong> Add Decision Policy</strong>
                </Typography>

                <Button
                    size='small'
                    onClick={() => handleCancelPolicy()}
                    sx={{ marginLeft: 'auto' }}
                    endIcon={
                        <CloseIcon />
                    }
                    variant="outlined"
                    color='error'
                >
                    Cancel
                </Button>
            </Box>

            <Box>
                <Controller
                    name={`policyMetadata.metadata`}
                    control={control}
                    rules={{
                        required: "Metadata is required"
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            required
                            label="Policy Metadata"
                            name="metadta"
                            fullWidth
                        />
                    )}
                />
                <Grid container spacing={2}>
                    <Grid item sx={{ mt: 1.5 }} md={6} xs={6}>
                        <Controller
                            name={`policyMetadata.decisionPolicy`}
                            control={control}
                            rules={{
                                required: "Decision policy is required"
                            }}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel id="Decision-Policy">
                                        Decision Policy Type *</InputLabel>
                                    <Select
                                        sx={{ textAlign: 'center' }}
                                        fullWidth
                                        {...field}
                                        placeholder='Decision policy*'
                                        labelId="Decision-Policy*"
                                        id="decision-policy"
                                        label="Decision Policy Type*"
                                        name='decisionPolicy'
                                    >
                                        <MenuItem value={'threshold'}>Threshold</MenuItem>
                                        <MenuItem value={'percentage'}>Percentage</MenuItem>
                                    </Select>
                                </FormControl>

                            )}
                        />
                    </Grid>
                    <Grid item sx={{}} md={6} xs={5}>
                        {
                            watch('policyMetadata.decisionPolicy') === 'percentage' ?
                                <Controller
                                    name={`policyMetadata.percentage`}
                                    control={control}
                                    rules={{
                                        required: "Percentage is required",
                                        min: 0,
                                        max: 1
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <TextField
                                                {...field}
                                                fullWidth
                                                sx={{ float: 'right', textAlign: 'right' }}
                                                name='percentage'
                                                label='Percentage*'
                                                type='number'
                                                placeholder='Percentage'
                                                error={errors?.policyMetadata?.percentage}
                                                helperText={errors?.policyMetadata?.percentage?.type === 'max' ?
                                                    'Invalid percentage' : errors?.policyMetadata?.percentage?.message ||
                                                    'Percentage must be in between 0 and 1.'}
                                            />
                                        </FormControl>
                                    )}
                                />
                                :
                                <Controller
                                    name={`policyMetadata.threshold`}
                                    control={control}
                                    rules={{
                                        required: "Threshold is required",
                                        min: 1,
                                        max: fields?.length,
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <TextField
                                                {...field}
                                                fullWidth
                                                name='threshold'
                                                type='number'
                                                label='Threshold*'
                                                placeholder='Threshold'
                                                error={errors?.policyMetadata?.threshold}
                                                helperText={errors?.policyMetadata?.threshold?.type === 'max' ?
                                                    'Invalid threshold' : errors?.policyMetadata?.threshold?.message ||
                                                    'Threshold can not be greater than members count.'}
                                            />
                                        </FormControl>
                                    )} />
                        }
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            fullWidth
                            name={`policyMetadata.votingPeriod`}
                            control={control}
                            rules={{
                                required: "Voting period is required",
                                min: 1
                            }}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        name='votingPeriod'
                                        type='number'
                                        label="Voting Period*"
                                        placeholder='Voting Period*'
                                        InputProps={{
                                            endAdornment: <FormControl sx={{ width: 150, mr: '-13px' }} fullWidth>
                                                <InputLabel>Duration*</InputLabel>
                                                <Select
                                                    fullWidth
                                                    required
                                                    placeholder='Duration*'
                                                    label="Duration*"
                                                    labelId="duration"
                                                    id="duration"
                                                    onChange={(e) => {
                                                        setValue('policyMetadata.votingPeriodDuration', e.target.value)
                                                        console.log('target value', e.target.value)
                                                    }}
                                                    value={watch('policyMetadata.votingPeriodDuration')}
                                                    name='votingPeriodDuration'
                                                >
                                                    <MenuItem defaultValue={'Days'}  value={'Days'}>Days</MenuItem>
                                                    <MenuItem defaultChecked value={'Hours'}>Hours</MenuItem>
                                                    <MenuItem value={'Minutes'}>Minutes</MenuItem>
                                                </Select>
                                            </FormControl>
                                        }}
                                        error={errors?.policyMetadata?.votingPeriod}
                                        helperText={errors?.policyMetadata?.votingPeriod?.message}
                                    />
                                    <Typography textAlign={'left'} variant='caption'>
                                       Info: A maximum time after submission that a proposal may be voted on before it is tallied
                                    </Typography>
                                </FormControl>
                            )} />

                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            fullWidth
                            name={`policyMetadata.minExecPeriod`}
                            control={control}
                            rules={{
                                required: "Min Exec Period is required",
                                min: 1
                            }}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        name='minExecPeriod'
                                        type='number'
                                        placeholder='Min Exection Period*'
                                        InputProps={{
                                            endAdornment: <FormControl sx={{ width: 150, mr: '-13px' }} fullWidth>
                                                <InputLabel>Duration*</InputLabel>
                                                <Select
                                                    fullWidth
                                                    required
                                                    label="Duration*"
                                                    labelId="duration"
                                                    id="duration"
                                                    onChange={(e) => {
                                                        setValue('policyMetadata.minExecPeriodDuration', e.target.value)
                                                        console.log('target value', e.target.value)
                                                    }}
                                                    value={watch('policyMetadata.minExecPeriodDuration')}
                                                    name='minExecPeriodDuration'
                                                >
                                                    <MenuItem value={'Days'}>Days</MenuItem>
                                                    <MenuItem value={'Hours'}>Hours</MenuItem>
                                                    <MenuItem value={'Minutes'}>Minutes</MenuItem>
                                                </Select>
                                            </FormControl>
                                        }}
                                        error={errors?.policyMetadata?.minExecPeriod}
                                        helperText={errors?.policyMetadata?.minExecPeriod?.message}
                                    />
                                    <Typography textAlign={'left'} variant='caption'>
                                       Info: A Minimum amount of time that must pass after submission in order for a proposal to potentially be executed.
                                    </Typography>
                                </FormControl>
                            )} />

                    </Grid>
                </Grid>
                <br/>
                <Box textAlign={'left'}>
                    <FormControlLabel
                        name="policyAsAdmin"
                        control={
                            <Switch {...register("policyMetadata.policyAsAdmin")}
                                name="policyAsAdmin" />
                        }
                        label="Group policy as admin"
                        labelPlacement="start"
                    /><br/>
                    <Typography variant='caption'>
                        Info: if set to true, the group policy account address will be used as
                        group and policy admin
                    </Typography>
                </Box>
            </Box>


        </Paper >

    )
}

export default CreateGroupPolicy