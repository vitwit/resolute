import {
    Box, TextField, IconButton,Grid,
} from '@mui/material';
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { Controller } from "react-hook-form";
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

export function CreateGroupForm({
    fields,
    control,
    append,
    remove
}) {
    return (
        <Box>
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
                            <Grid item md={4.8}>
                                <Controller
                                    name={`members.${index}.metadata`}
                                    control={control}
                                    rules={{ required: "Metadata is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="Metadata"
                                            multiline
                                            name="metadata"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid sx={{ display: 'flex' }}
                                item container md={1.2}>
                                <IconButton onClick={() => remove(index)} color='error'>
                                    <DeleteOutline />
                                </IconButton>
                                <IconButton onClick={() => {
                                    append({ address: '', metadata: '', weight: 0 })
                                }} color='primary'>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    })
                }
            </Grid>
        </Box>
    )
}

export default CreateGroupForm