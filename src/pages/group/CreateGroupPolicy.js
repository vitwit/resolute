import {
    Box, Button, TextField, Select, MenuItem, FormControlLabel, Switch, Typography, Grid, FormControl, InputLabel, InputAdornment,
} from '@mui/material';
import React, { useState } from 'react'

function CreateGroupPolicy({ handlePolicy }) {
    var [policies, setPolicies] = useState([]);
    const [policy, setPolicy] = useState({});
    const [editIndex, setEditIndex] = useState(-1);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleChange = (e) => {
        policy[e.target.name] = e.target.value;
        if (e.target.name === 'decisionPolicy') {
            if (e.target.value === 'percentage') {
                policy['threshold'] = 0;
            } else if (e.target.value === 'threshold') {
                policy['percentage'] = 0;
            }
        }
        setPolicy({ ...policy })
        handlePolicy(policy)
    }

    return (
        <div>
            <Box sx={{ textAlign: 'right' }}>
                {
                    !policies.length ?
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setShowAddForm(true)
                                setEditIndex(-1)
                            }}
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Attach Decision Policy
                        </Button> : null

                }
                <br /><br />


            </Box>
            {
                showAddForm ?
                    <Box sx={{
                        border: '1px solid #eeeeee',
                        p: 2,
                        mt: 2,
                        borderRadius: 2
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography
                                sx={{
                                    fontSize: 22
                                }}>Add Decision Policy</Typography>
                            {
                                showAddForm ?
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setShowAddForm(false)
                                            setEditIndex(-1)
                                        }}
                                        sx={{
                                            textTransform: "none",
                                            color: 'red',
                                            borderColor: 'red',
                                            textAlign: 'right',
                                            marginLeft: 'auto'
                                        }}
                                    >
                                        Remove Decision Policy
                                    </Button> : null
                            }
                        </Box>
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
                                            onChange={handleChange}
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
                                            value={policy.minExecPeriod}
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


                    </Box> : null
            }
        </div>
    )
}

export default CreateGroupPolicy