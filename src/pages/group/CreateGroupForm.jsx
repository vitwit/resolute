import {
    Box, TextField, IconButton, Grid, Button, Paper, Typography,
} from '@mui/material';
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Controller } from "react-hook-form";
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';

export function CreateGroupForm({
    fields,
    control,
    append,
    remove
}) {
    return (
        <Box>
            {
                fields?.length && <Paper variant='outlined' sx={{ p: 2 }}>
                    <Typography variant='p'
                        sx={{ float: 'left' }}
                        fontWeight={'bold'}
                    >
                        Group Members
                    </Typography><br />
                    <Typography sx={{ float: 'left' }} variant='caption'>
                        Include members in the group with address, weight and metadata.
                    </Typography>
                    <Grid>
                        {
                            fields.map((item, index) => {
                                return <Grid key={item?.id} item container columnSpacing={{ md: 1 }}>
                                    <Grid item md={4.7}>
                                        <Controller
                                            name={`members.${index}.address`}
                                            control={control}
                                            rules={{ required: "Address is required" }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    required
                                                    label="Member Address"
                                                    name="address"
                                                    fullWidth

                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item md={1.3}>
                                        <Controller
                                            name={`members.${index}.weight`}
                                            control={control}
                                            rules={{
                                                min: 1,
                                                required: "Weight is required"
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    type={'number'}
                                                    {...field}
                                                    required
                                                    label="Weight"
                                                    name="weight"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item md={5.5}>
                                        <Controller
                                            name={`members.${index}.metadata`}
                                            control={control}
                                            rules={{ required: "Metadata is required" }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    required
                                                    label="Member Metadata"
                                                    multiline
                                                    name="metadata"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid sx={{ display: 'flex' }}
                                        item container md={0.5}>

                                        <IconButton onClick={() => remove(index)} color='error'>

                                            <Close />
                                        </IconButton>
                                        {/* {
                                    (fields.length - 1) === index ?
                                        <IconButton onClick={() => {
                                            append({ address: '', metadata: '', weight: 0 })
                                        }} color='primary'>
                                            <AddIcon />
                                        </IconButton> : null
                                } */}

                                    </Grid>
                                    {
                                        (fields.length - 1) === index ?
                                            <Button
                                                size='small'
                                                onClick={() => {
                                                    append({ address: '', metadata: '', weight: 0 })
                                                }}
                                                sx={{ ml: 'auto' }} variant='outlined'>
                                                Add Another Member
                                            </Button> : null
                                    }
                                </Grid>
                            })
                        }
                    </Grid>
                </Paper> || null
            }

            <br />

        </Box>
    )
}

export default CreateGroupForm