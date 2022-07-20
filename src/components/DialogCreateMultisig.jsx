import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm, Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { setError } from '../features/common/commonSlice';
import { createMultiSig } from '../txns/multisig';
import { createAccount } from '../features/multisig/multisigSlice';


const InputTextComponent = ({ field, index, handleChangeValue, handleRemoveValue }) => {
    return (
        <>
            <Grid item>
                <Grid xs={12}>
                    <TextField
                        style={{ marginTop: 12, marginBotton: 16 }}
                        onChange={(e) => {
                            handleChangeValue(index, e)
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
                                }} position="end">
                                    <DeleteIcon />
                                </InputAdornment>,
                        }}
                    />
                </Grid>

            </Grid>
        </>

    )
}

export function DialogCreateMultisig(props) {
    const { onClose, open,
        addressPrefix,
        chainId, loading } = props;

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
        label: 'Pubkey',
        placeHolder: 'Add Account Pubkey',
        required: true,
    };

    const [pubKeyFields, setPubKeyFields] = useState([{ ...pubKeyObj }, { ...pubKeyObj }]);
    const [threshold, setThreshold] = useState(0);
    const [name, setName] = useState(null);

    const handleAddPubKey = () => {
        if (pubKeyFields.length > 6) {
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
        let pubKeyFieldsArr = pubKeyFields.splice(i, 1);
        setPubKeyFields([...pubKeyFields])
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

        if (!pubKeys.length) {
            dispatch(setError('Atleast 1 pubkey is required'))
            return
        }

        let uniquePubKeys = Array.from(new Set(pubKeys))

        if (uniquePubKeys.length !== pubKeys.length) {
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
        if (e.target.value > pubKeyFields.length) {
            alert('Threshold can not be greater than pubkeys')
            return
        }
        setThreshold(e.target.value);
    }

    const [value, setValue] = React.useState(0);


    const handleClose = () => {
        onClose();
    };

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    return (
        <>
            <Dialog fullWidth maxWidth={'sm'} onClose={handleClose} open={open}>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <h3 style={{textAlign: 'center'}}>Create Mulitsig Address</h3>
                        <Grid xs={12}>
                            <TextField
                                style={{ marginTop: 12, marginBotton: 16 }}
                                onChange={handleNameChange}
                                name={'name'}
                                value={name}
                                required={true}
                                label={'Name'}
                                placeholder={'Enter name'}
                                fullWidth
                            />
                        </Grid>
                        {pubKeyFields.map((field, index) => (
                            <InputTextComponent
                                handleRemoveValue={handleRemoveValue}
                                handleChangeValue={handleChangeValue}
                                index={index} field={field} />
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'right', marginTop: 12 }}>
                            <Button onClick={handleAddPubKey}
                                endIcon={<AddOutlinedIcon />}
                                variant='contained'
                                disableElevation
                            >
                                Add
                            </Button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                            <TextField
                                name="threshold"
                                value={threshold}
                                inputProps={{ maxLength: 1 }}
                                onChange={handleChange}
                                label="Threshold"
                                style={{ maxWidth: 120 }}
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
                                value={pubKeyFields.length}
                                label="Threshold"
                                disabled
                                style={{ maxWidth: 120 }}
                            />
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant='outlined'
                            color='secondary'
                            className='button-capitalize-title'
                            disableElevation
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            disableElevation
                            type='submit'
                            disabled={loading === 'pending'}
                            className='button-capitalize-title'
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
    onDelegate: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    validator: PropTypes.object.isRequired,
    balance: PropTypes.number.isRequired,
};
