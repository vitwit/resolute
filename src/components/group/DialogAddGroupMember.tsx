import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';

export interface DefaultFields {
    address: string;
    metadata: string;
    weight: string;
}

export interface DialogAddGroupMemberProps {
    onAddMember: (address: string, metadata: string, weight: string) => void;
    onClose: () => void;
    open: boolean;
    defaultFields:  DefaultFields;
}

export default function DialogAddGroupMember (props: DialogAddGroupMemberProps) {
    const { open, onClose, onAddMember, defaultFields} = props;


    const { handleSubmit, control,setValue, formState: { errors } } = useForm({
        defaultValues: {
            address: defaultFields.address,
            metadata: defaultFields.metadata,
            weight: defaultFields.weight,
        }
    });

    setValue("address", defaultFields.address)
    setValue("weight", defaultFields.weight)
    setValue("metadata", defaultFields.metadata)

    const onSubmit = (data: any) => {
        onAddMember(data.address, data.metadata, data.weight)
    }

    return (
        <Dialog onClose={() => onClose()} open={open}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Typography
                            variant='h6'
                            color='text.primary'
                            fontWeight={800}
                            style={{textAlign: 'center'}}
                        >
                            Add Group Member
                        </Typography>

                        <div
                            style={{ marginTop: 16 }}
                        >
                            <Controller
                                name="address"
                                control={control}
                                rules={{ required: 'Address is required'}}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Member address"
                                        style={{marginTop: 8, marginBottom: 8}}
                                        fullWidth
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                    />}
                            />
                            <Controller
                                name="weight"
                                control={control}
                                rules={{ required: 'Weight is required'}}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Member weight"
                                        fullWidth
                                        style={{marginTop: 8, marginBottom: 8}}
                                        error={!!errors.weight}
                                        helperText={errors.weight?.message}
                                    />}
                            />
                            <Controller
                                name="metadata"
                                control={control}
                                rules={{ required: 'Metadata is required'}}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        style={{marginTop: 8, marginBottom: 8}}
                                        label="Metadata"
                                        fullWidth
                                        error={!!errors.metadata}
                                        helperText={errors.metadata?.message}
                                    />}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant='outlined'
                            color='secondary'
                            className='button-capitalize-title'
                            disableElevation
                            onClick={() => onClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            disableElevation
                            type='submit'
                            className='button-capitalize-title'
                        >
                            Add Member
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
    );
}