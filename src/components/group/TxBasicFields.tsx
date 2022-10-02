import { Grid, TextField } from '@mui/material';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import FeeComponent from '../multisig/FeeComponent';

interface TxBasicFieldsProps {
    chainInfo: any
}

function TxBasicFields({
    chainInfo
}: TxBasicFieldsProps) {
    const { handleSubmit, control, 
        setValue, formState:{errors}, } = useFormContext();

    return (
        <Grid
            container
            spacing={2}
            sx={{
                mt: 2,
            }}
        >
            <Grid item xs={12} md={4}>
                <Controller
                    name="gas"
                    control={control}
                    rules={{ required: "Gas is required" }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            sx={{
                                mb: 2,
                            }}
                            {...field}
                            error={!!error}
                            size="small"
                            helperText={error ? error.message : null}
                            type="number"
                            required
                            label="Gas"
                            fullWidth
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <Controller
                    name="memo"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            sx={{
                                mb: 2,
                            }}
                            size="small"
                            {...field}
                            label="Memo"
                            fullWidth
                        />
                    )}
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={12}
                sx={{
                    pt: 0,
                    textAlign: "left",
                }}
            >
                <FeeComponent
                    // sx={{
                    //     pt: 0,
                    //     textAlign: "left",
                    // }}
                    onSetFeeChange={(v: any) => {
                        setValue(
                            "fees",
                            Number(v) *
                            10 **
                            chainInfo?.config?.currencies[0].coinDecimals
                        );
                    }}
                    chainInfo={chainInfo}
                />
            </Grid>
        </Grid>
    )
}

export default TxBasicFields