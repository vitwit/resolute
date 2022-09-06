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

interface member {
    address: string;
    metadata: string;
    weight: string;
}

interface UpdateGroupMemberProps {
    members: Array<any>,
    handleUpdate: any
}

export function UpdateGroupMemberForm({ members, handleUpdate }: UpdateGroupMemberProps) {
    var [memberObjs, setMemberObjs] = useState([...members]);

    const handleChange = (i: number,
        e: { target: { name: string, value: string } }) => {
        let obj = memberObjs[i];
        obj = {
            ...obj,
            [e.target.name]: e.target.value
        }
        memberObjs[i] = obj;
        setMemberObjs([...memberObjs])
    }

    const handleSubmit = (i: number) => {
        memberObjs = [...memberObjs, { address: '', weight: '', metadata: '' }]
        setMemberObjs(memberObjs)
    }

    return (
        <div>
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
                                                    {/* {
                                                        memberObjs.length === 1 ? */}
                                                    <DeleteOutline sx={{ mr: 2 }} onClick={() => {
                                                        memberObjs.splice(i, 1);
                                                        setMemberObjs([...memberObjs]);
                                                    }} />
                                                    <Button variant='outlined'
                                                        onClick={() => handleSubmit(i)}>+</Button>
                                                </Box>

                                        }
                                    </Grid>
                                </Grid>
                            ))}

                            <Grid>
                                <Button
                                    onClick={() => handleUpdate(memberObjs)}
                                    variant='outlined'>
                                    Update
                                </Button><br /><br />
                            </Grid>

                        </Box> : null
                }
            </Box>
        </div>
    )
}

export default UpdateGroupMemberForm