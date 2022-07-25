import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from '@mui/material/DialogTitle';
import { setError } from '../features/common/commonSlice';
import { createMultiSig } from '../txns/multisig';
import { createAccount } from '../features/multisig/multisigSlice';
import Box from '@mui/system/Box';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';

const InputTextComponent = ({ field, index, handleChangeValue, handleRemoveValue }) => {
    return (
        <TextField
            onChange={(e) => {
                handleChangeValue(index, e)
            }}
            sx={{
                mt: 2,
            }}
            name={field.name}
            value={field.value}
            required={field?.required}
            label={field.label}
            placeholder={field.placeHolder}
            fullWidth
            InputProps={{
                endAdornment:
                    <InputAdornment onClick={() => {
                        handleRemoveValue(index)
                    }} position="end"
                        sx={{
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}
                    >
                        <DeleteIcon />
                    </InputAdornment>,
            }}
        />
    )
}

export function DialogCreateMultisig(props) {
    const { onClose, open,
        addressPrefix,
        chainId } = props;

    const createMultiAccRes = useSelector((state) => state.multisig.createMultisigAccountRes);

    const dispatch = useDispatch();

    useEffect(() => {
        if (createMultiAccRes?.status === 'done') {
            dispatch(setError({
                type: 'success',
                message: 'Successfully created'
            }))
        }
    }, [createMultiAccRes])

    const pubKeyObj = {
        name: 'pubKey',
        value: '',
        label: 'Public Key (Secp256k1)',
        placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
        required: true,
    };

    const [pubKeyFields, setPubKeyFields] = useState([{ ...pubKeyObj }]);
    const [threshold, setThreshold] = useState(0);
    const [name, setName] = useState('');

    const handleAddPubKey = () => {
        if (pubKeyFields?.length > 6) {
            dispatch(setError({
                type: 'error', message: `You can't add more than 7 pub keys`
            }))
            return
        } else {
            let arr = [...pubKeyFields, pubKeyObj];
            setPubKeyFields([...arr])
        }
    }

    const handleRemoveValue = (i) => {
        if (pubKeyFields.length > 1) {
            pubKeyFields.splice(i, 1);
            setPubKeyFields([...pubKeyFields]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Number(threshold) < 1) {
            dispatch(setError({
                type: 'error',
                message: 'Threshold must be greater than 1'
            }))
            return
        }

        let pubKeys = pubKeyFields.map(v => v.value);

        if (!pubKeys?.length) {
            dispatch(setError('Atleast 1 pubkey is required'))
            return
        }

        let uniquePubKeys = Array.from(new Set(pubKeys))

        if (uniquePubKeys?.length !== pubKeys?.length) {
            dispatch(setError({
                type: 'error',
                message: 'You have entered duplicate pubkeys'
            }))
            return
        }

        createMultiSig(pubKeys, Number(threshold), addressPrefix, chainId).then(res => {
            res.name = name;
            dispatch(createAccount(res))
        }).catch(err => {
            console.log('err=>', err.message)
        })
    }

    const handleChangeValue = (index, e) => {
        const newInputFields = pubKeyFields.map((value, key) => {
            if (index === key) {
                value['value'] = e.target.value
            }
            return value;
        })

        setPubKeyFields(newInputFields);
    }

    const handleChange = (e) => {
        if (e.target.value > pubKeyFields?.length) {
            alert('Threshold can not be greater than pubkeys')
            return
        }
        setThreshold(e.target.value);
    }

    const handleClose = () => {
        onClose();
    };

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    return (
        <>
            <Dialog fullWidth maxWidth={'sm'} onClose={handleClose} open={open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }} variant='h6' >
                    Create Multisig Account
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            onChange={handleNameChange}
                            name={'name'}
                            value={name}
                            required={true}
                            label={'Name'}
                            placeholder={'E.g. Alice'}
                            fullWidth
                        />
                        {pubKeyFields.map((field, index) => (
                            <InputTextComponent
                                key={index}
                                handleRemoveValue={handleRemoveValue}
                                handleChangeValue={handleChangeValue}
                                index={index} field={field} />
                        ))}
                        <Box
                            sx={{
                                mt: 2,
                                textAlign: 'right'
                            }}
                        >
                            <Button onClick={handleAddPubKey}
                                variant='contained'
                                disableElevation
                                sx={{
                                    textTransform: 'none'
                                }}
                            >
                                Add another public key
                            </Button>
                        </Box>

                        <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                                mt: 2,
                                textAlign: 'center'
                            }}
                        >
                            Threshold: Signatures required to send a transaction
                        </Typography>

                        <Box
                            sx={{
                                mt: 1,
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <TextField
                                name="threshold"
                                value={threshold}
                                inputProps={{ maxLength: 1 }}
                                onChange={handleChange}
                                label=""
                                type='number'
                                size='small'
                                style={{ maxWidth: 75 }}
                            />
                            <Typography
                                variant='body1'
                                color='text.primary'
                                style={{ margin: 'auto 0px auto 0px' }}
                            >
                                &nbsp;&nbsp;Of&nbsp;&nbsp;
                            </Typography>
                            <TextField
                                name="threshold"
                                value={pubKeyFields?.length}
                                label=""
                                disabled
                                size='small'
                                style={{ maxWidth: 75 }}
                            />
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant='outlined'
                            color='secondary'
                            sx={{
                                textTransform: 'none'
                            }}
                            disableElevation
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            disableElevation
                            type='submit'
                            disabled={createMultiAccRes?.status === 'pending'}
                            sx={{
                                textTransform: 'none'
                            }}
                        >
                            {createMultiAccRes?.status === 'pending' ? <CircularProgress size={25} /> : 'Create'}
                        </Button>
                    </DialogActions>

                </form>
            </Dialog>
        </>
    );
}

DialogCreateMultisig.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    addressPrefix: PropTypes.string.isRequired,
    chainId: PropTypes.string.isRequired,
};
