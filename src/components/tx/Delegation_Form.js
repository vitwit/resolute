import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Decimal } from "@cosmjs/math";
import { calculateFee } from '@cosmjs/stargate'
import { useDispatch, useSelector } from 'react-redux';
import { createTxn } from '../../features/multisig/multisigSlice';


const Delegation_Form = ({chainInfo}) => {
    const dispatch = useDispatch();
    const currency = chainInfo.config.currencies[0];

    const multisigAddress = localStorage.getItem('multisigAddress')
        && JSON.parse(localStorage.getItem('multisigAddress')) || {}

    var validators = useSelector((state) => state.staking.validators);

    validators = validators && validators.active || {};
    const [valAddress, setValAddress] = useState(null);
    var [data, setData] = useState([]);
    const [obj, setObj] = useState({})

    const handleChange = (e) => {
        obj[e.target.name] = e.target.value;
        setObj({ ...obj });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('ddddddd', obj)

        const amountInAtomics = Decimal.fromUserInput(
            obj?.amount,
            Number(chainInfo.config.currencies[0].coinDecimals),
        ).atomics;

        const msgSend = {
            delegatorAddress: multisigAddress?.address,
            validatorAddress: obj?.validator_address,
            amount: {
                amount: amountInAtomics,
                denom: chainInfo.config.currencies[0].coinMinimalDenom,
            },
        };

        const msg = {
            typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
            value: msgSend,
        };

        const fee = calculateFee(Number(300000), '0.000003stake');

        let delegationObj =  {
            address: multisigAddress?.address,
            chainId: chainInfo?.config?.chainId,
            msgs: [msg],
            fee: fee,
            memo: obj?.memo,
            gas: obj?.gas
        };

        dispatch(createTxn(delegationObj))
    }

    useEffect(() => {
        data = [];
        Object.entries(validators).map(([k, v], index) => {
            let obj1 = {
                value: k,
                label: v.description.moniker
            }

            data = [...data, obj1];
        })

        setData([...data])
    }, [validators])


    const handleChange1 = (e) => {
        setValAddress(e.target.value);
        let o = JSON.parse(e.target.value);
        obj['validator_address'] = o.value;

        setObj({ ...obj })
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, obj)}>
            <br /><br />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                    Select Validator
                </InputLabel>
                <Select
                    name="toAddress"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={valAddress}
                    label="Select Validator"
                    onChange={handleChange1}
                >
                    {
                        data.map((v, k) =>
                            <MenuItem value={JSON.stringify(v)}>{v.label}</MenuItem>
                        )
                    }

                </Select>
            </FormControl>
            <TextField
                name="amount" value={obj.amount} onChange={handleChange}
                label="Amount"
                fullWidth
                style={{ marginTop: 8, marginBottom: 8 }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                }}
            />
            <TextField
                name="gas" value={obj.gas} onChange={handleChange}
                label="Gas"
                fullWidth
                style={{ marginTop: 8, marginBottom: 8 }}
            />
            <TextField
                name="memo" value={obj.memo} onChange={handleChange}
                label="Memo"
                fullWidth
                style={{ marginTop: 8, marginBottom: 8 }}
            />
            <Button type="submit" variant='contained' disableElevation
                style={{ marginTop: 16 }}
                className='button-capitalize-title'

            >Create Transaction</Button>
        </form>
    )
}

export default Delegation_Form