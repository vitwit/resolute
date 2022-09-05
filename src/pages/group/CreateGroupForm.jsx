import {
    Box, Button, Table, TableCell, TableHead,
    TableContainer,
    TableBody,
    Paper,
    TableRow, TextField, Typography, Grid,
} from '@mui/material';
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import React, { useState } from 'react';

const memberObj = {
    address: '',
    weight: '',
    metadata: '',
}

export function CreateGroupForm({ handleMembers }) {
    const [memberObjs, setMemberObjs] = useState([]);

    const handleChange = (i, e) => {
        const obj = memberObjs[i];
        obj[e.target.name] = e.target.value;
        memberObjs[i] = obj;
        setMemberObjs([...memberObjs])
        handleMembers(memberObjs)
    }

    const handleSubmit = () => {
        setMemberObjs([...memberObjs, { address: '', weight: '', metadata: '' }])
    }

    return (
        <div>
            <Box sx={{ textAlign: 'right' }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setMemberObjs([...memberObjs, { address: '', weight: '', metadata: '' }])
                    }}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    Add Group Member
                </Button>
            </Box>

            <Box>
                {
                    memberObjs.length ?
                        <Box>
                            <Typography sx={{ fontSize: 23, mb: 3 }}>
                                Members
                            </Typography>
                            {memberObjs.map((row, i) => (
                                <Grid sx={{ flexGrow: 1 }} spacing={1} container md={12}>
                                    <Grid sx={{ m: 1 }} spacing={2} md={4}>
                                        <TextField
                                            sx={{ width: '100%' }}
                                            name="address"
                                            onChange={(e) => handleChange(i, e)}
                                            value={row?.address} placeholder='Member Address' />
                                    </Grid>
                                    <Grid sx={{ m: 1 }} spacing={2} md={1.5}>
                                        <TextField
                                            sx={{ width: '100%' }}
                                            name='weight'
                                            onChange={(e) => handleChange(i, e)}
                                            value={row?.weight} placeholder='Weight' />
                                    </Grid>
                                    <Grid sx={{ m: 1 }} md={4.5}>
                                        <TextField
                                            sx={{ width: '100%' }}
                                            name="metadata"
                                            onChange={(e) => handleChange(i, e)}
                                            value={row?.metadata} placeholder='Metadata' />
                                    </Grid>
                                    <Grid sx={{ m: 1 }} md={1}>
                                        {
                                            i !== memberObjs.length - 1 ?
                                                <Box sx={{
                                                    pt: 3
                                                }}>
                                                    <DeleteOutline onClick={() => {
                                                        memberObjs.splice(i, 1);
                                                        setMemberObjs([...memberObjs]);
                                                    }} />
                                                </Box> :
                                                <Box sx={{ display: 'flex', p: 2 }}>
                                                    {
                                                        memberObjs.length === 1 ?
                                                            <DeleteOutline sx={{ mr: 2 }} onClick={() => {
                                                                memberObjs.splice(i, 1);
                                                                setMemberObjs([...memberObjs]);
                                                            }} /> : null
                                                    }
                                                    <Button variant='outlined'
                                                        onClick={() => handleSubmit(i)}>+</Button>
                                                </Box>

                                        }
                                    </Grid>
                                </Grid>
                            ))}
                        </Box> : null
                }
            </Box>
        </div>
    )
}

export default CreateGroupForm