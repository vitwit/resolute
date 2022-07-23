import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';

export interface DialogAttachPolicyProps {
    onAttachPolicy: (address: string, metadata: string, weight: string) => void;
    onClose: () => void;
    open: boolean;
}

interface IFormInput {
    metadata: string;
    policyAsAdmin: boolean;
    decisionPolicy: {label: string; value: string };
  }

export default function DialogAttachPolicy (props: DialogAttachPolicyProps) {
    const { open, onClose, onAttachPolicy} = props;


    const { handleSubmit, control,setValue, formState: { errors } } = useForm<IFormInput>({
        defaultValues: {
            metadata: '',
            policyAsAdmin: false,
            decisionPolicy: {},
        }
    });

    const onSubmit = (data: any) => {
        console.log(data);
        // onAddMember(data.address, data.metadata, data.weight)
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
                            Add Group Policy
                        </Typography>

                        <div
                            style={{ marginTop: 16 }}
                        >
                            <Controller
                                name="metadata"
                                control={control}
                                rules={{ required: 'Metadata is required'}}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Policy metadata"
                                        style={{marginTop: 8, marginBottom: 8}}
                                        fullWidth
                                        error={!!errors.metadata}
                                        helperText={errors.metadata?.message}
                                    />}
                            />
                            <Controller
                                name="policyAsAdmin"
                                control={control}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        label="Policy as admin"
                                        fullWidth
                                        style={{marginTop: 8, marginBottom: 8}}
                                        helperText='if set to true, the group policy account address will be used as group and policy admin'
                                    />}
                            />
                            <Controller
                                name="decisionPolicy"
                                control={control}
                                render={({ field }) => <Select
                                fullWidth
                                  {...field} 
                                >
                                    <MenuItem value='threshold'>Threshold policy</MenuItem>
                                    <MenuItem value='percentage'>Percentage policy</MenuItem>
                                    </Select>
                                }
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