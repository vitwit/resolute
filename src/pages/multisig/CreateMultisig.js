import { Button, Paper, TextField } from '@mui/material'
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createMultiSig } from '../../txns/multisig';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const InputTextComponent = ({ field, index, handleChangeValue }) => {
    console.log(field)
    return (
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
        />
    )
}

export default function CreateMultisig() {
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const { chainId, config } = chainInfo;
    const addressPrefix = config?.bech32Config?.bech32PrefixAccAddr;

    const pubKeyObj = {
        name: 'pubKey',
        value: '',
        label: 'Pubkey',
        placeHolder: 'Add Pubkey',
        required: true,
    };

    const [pubKeyFields, setPubKeyFields] = useState([{ ...pubKeyObj }]);
    const [threshold, setThreshold] = useState(0);

    const handleAddPubKey = () => {
        let arr = [...pubKeyFields, pubKeyObj];
        setPubKeyFields([...arr])
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let pubKeys = pubKeyFields.map(v => v.value);

        createMultiSig(pubKeys, threshold, addressPrefix, chainId).then(res => {
            console.log('res', res)
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

    const [value, setValue] = React.useState(0);

    const handleChange1 = (event, newValue) => {
        setValue(newValue);
    };

    const handleChange = (e) => {
        if (e.target.value > pubKeyFields.length) {
            alert('Threshold can not be greater than pubkeys')
            return
        }
        setThreshold(e.target.value);
    }

    return (
        <Grid container>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={10} md={8}>
                <Paper elevation={0} style={{ padding: 22 }}>
                    <Typography
                        variant='h6'
                        fontWeight={600}
                        color='text.primary'
                        gutterBottom
                    >
                        Create Multisig Account
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        {pubKeyFields.map((field, index) => (
                            <InputTextComponent
                                handleChangeValue={handleChangeValue} index={index} field={field} />
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
                        <Button
                            type="submit"
                            style={{ marginTop: 24 }}
                            variant='contained'
                            disableElevation
                            className='button-capitalize-title'
                        >Create</Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={1} md={2}></Grid>
        </Grid>
    )
}