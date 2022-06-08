import { Button, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createMultiSig } from '../../txns/multisig';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const InputTextComponent = ({ field, index, handleChangeValue }) => {
    return (
        <div className='m-20'>
            <TextField
                onChange={(e) => {
                    handleChangeValue(index, e)
                }}
                name={field.name}
                value={field.value}
                required={field?.required}
                label={field.label}
                fullWidth
            />
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function CreateMultisig() {
    const chainInfo = useSelector((state) => state.wallet.chainInfo);
    const { chainId, config } = chainInfo;
    const addressPrefix = config?.bech32Config?.bech32PrefixAccAddr;

    const pubKeyObj = {
        name: 'pubKey',
        value: '',
        label: 'Pubkey'
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

    const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
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
        <div>
            <div>
                <h3>Create Multisignature</h3>
            </div>
            <div className='m-20'>
                <Paper elevation={0} className="pd-22">
                    <form onSubmit={handleSubmit}>
                        {pubKeyFields.map((field, index) => (
                            <InputTextComponent handleChangeValue={handleChangeValue} index={index} field={field} />
                        ))}

                        <div className='f-right'>
                            <Button onClick={handleAddPubKey}>Add +</Button>
                        </div>

                        <div className='m-20'>
                            <TextField
                                name="threshold" value={threshold} onChange={handleChange}
                                label="Threshold"
                            />
                            <span style={{ margin: 20, justifyContent: 'center', }}>  Of</span>
                            <TextField
                                name="threshold" value={pubKeyFields.length}
                                label="Threshold"
                                disabled
                            />
                        </div>
                        <div className='m-t-40'>
                            <Button type="submit">Create</Button>
                        </div>
                    </form>
                </Paper>

            </div>
        </div>
    )
}