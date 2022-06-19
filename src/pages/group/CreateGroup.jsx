
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import DialogAddGroupMember from '../../components/group/DialogAddGroupMember';
import { IconButton, Paper, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { shortenAddress } from '../../utils/util';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function CreateGroupPage() {

    const [showMemberDialog, setShowMemberDialog] = useState(false);
    const [members, setMembers] = useState([]);

    const showGroupMemberDialog = () => {
        setShowMemberDialog(true);
    }

    const { handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            metadata: '',
        }
    });

    const onSubmit = data => {
        console.log(data);
    }

    const [memberFields, setMemberFields] = useState({
        address: '',
        weight: '',
        metadata: ''
    })
    const removeMember = (address) => {
        const newMembers = members.filter(function (member) {
            return member.address != address;
        });
        setMembers(newMembers);
    }

    const editMember = (address, weight, metadata) => {
        setMemberFields({
            address: address,
            weight: weight,
            metadata: metadata
        })
        setShowMemberDialog(true);
    }

    return (
        <>
            {
                showMemberDialog ?
                    <DialogAddGroupMember
                        open={showMemberDialog}
                        defaultFields={memberFields}
                        onAddMember={(address, metadata, weight) => {
                            for (let i = 0; i < members.length; i++) {
                                if (members[i].address === address) {
                                    members[i] = {
                                        address: address,
                                        metadata: metadata,
                                        weight: weight
                                    }
                            setShowMemberDialog(false);
                                    return
                                }
                            }

                            setMembers([
                                ...members,
                                {
                                    address: address,
                                    metadata: metadata,
                                    weight: weight
                                }
                            ])

                            setShowMemberDialog(false);
                        }}
                        onClose={() => setShowMemberDialog(false)}
                    />
                    :
                    <></>
            }
            <Paper
                elevation={0}
                sx={{ p: 2 }}
            >
                <Typography
                    color='text.primary'
                    variant='h6'
                    fontWeight={600}
                >
                    Create Group
                </Typography>
                <Box

                    noValidate
                    autoComplete="off"
                    sx={{
                        '& .MuiTextField-root': { mt: 1.5, mb: 1.5 },
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Controller
                                name="metadata"
                                control={control}
                                rules={{ required: 'Metadata is required' }}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        required
                                        label="Metadata"
                                        fullWidth
                                    />}
                            />
                        </div>
                        <div>
                            <Typography
                                variant='body1'
                                color='text.primary'
                                fontWeight={500}
                                style={{ textAlign: 'left' }}
                            >
                                Members
                            </Typography>
                            {
                                members.map((member, index) =>
                                    <MemberItem
                                        key={index}
                                        member={member}
                                        onRemove={removeMember}
                                        onEdit={editMember}

                                    />
                                )
                            }
                        </div>

                        <div>
                            <Button
                                onClick={() => {
                                    setMemberFields({
                                        address: '',
                                        metadata: '',
                                        weight: ''
                                    })
                                    showGroupMemberDialog()
                                }
                                }
                            >
                                Add member
                            </Button>
                        </div>

                        <div>
                            <Button
                                type='submit'
                                variant='outlined'
                                disableElevation
                                size='medium'
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </Box>
            </Paper>
        </>
    );
}

function MemberItem(props) {
    const { address, weight, metadata } = props.member;
    const { onRemove, onEdit } = props;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}
        >
            <div>&nbsp;</div>
            <TextField
                value={shortenAddress(address, 21)}
                variant='outlined'
                size='small'
                disabled
                label='Address'
            >
            </TextField>
            <TextField
                value={weight}
                variant='outlined'
                size='small'
                disabled
                label='Weight'
            >
            </TextField>
            <TextField
                value={metadata}
                variant='outlined'
                size='small'
                disabled
                label='Metadata'
            >
            </TextField>
            <IconButton aria-label='remove member' color='error'
                onClick={() => onRemove(address)}
            >
                <DeleteOutline />

            </IconButton>
            <IconButton aria-label='edit member' color='secondary'
                onClick={() => onEdit(address, weight, metadata)}
            >
                <ModeEditOutlineOutlinedIcon />

            </IconButton>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
        </div>
    );
}