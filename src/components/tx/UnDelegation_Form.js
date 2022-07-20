import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Decimal } from "@cosmjs/math";
import { calculateFee } from '@cosmjs/stargate'
import { useDispatch, useSelector } from 'react-redux';
import { createTxn, getDelegatorValidators } from '../../features/multisig/multisigSlice';
import { Redelegate, UnDelegate } from '../../txns/proto';
import { fee } from '../../txns/execute';

const UnDelegation_Form = ({ chainInfo }) => {
    const dispatch = useDispatch();

    const currency = chainInfo.config.currencies[0];

    const multisigAddress = localStorage.getItem('multisigAddress')
        && JSON.parse(localStorage.getItem('multisigAddress')) || {}

    var validators = useSelector((state) => state.staking.validators);
    var delegatorVals = useSelector(state => state.multisig.delegatorVals)

    validators = validators && validators.active || {};
    const [fromValAddress, setFromValAddress] = useState(null);
    const [toValAddress, setToValAddress] = useState(null);

    var [data, setData] = useState([]);
    const [obj, setObj] = useState({});
    var [dValidators, setDvalidators] = useState([]);

    useEffect(() => {
        var { validators: delValidators } = delegatorVals;

        dValidators = [];
        delValidators && delValidators.map((obj, key) => {
            let obj1 = {
                value: obj?.operator_address,
                label: obj?.description?.moniker
            }

            dValidators = [...dValidators, obj1];
        })

        setDvalidators([...dValidators])
    }, [delegatorVals])

    const handleChange = (e) => {
        obj[e.target.name] = e.target.value;
        setObj({ ...obj });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const amountInAtomics = Decimal.fromUserInput(
            obj?.amount,
            Number(chainInfo.config.currencies[0].coinDecimals),
        ).atomics;

        const feeObj = fee(chainInfo?.config.currencies[0].coinMinimalDenom,
            chainInfo?.config?.gasPriceStep?.average,
            300000)

        const msg = UnDelegate(multisigAddress?.address,
            obj?.fromValidator, amountInAtomics,
            chainInfo.config.currencies[0].coinMinimalDenom);


        let delegationObj = {
            address: multisigAddress?.address,
            chainId: chainInfo?.config?.chainId,
            msgs: [msg],
            fee: feeObj,
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
        let o = JSON.parse(e.target.value);
        obj['validator_address'] = o.value;

        setObj({ ...obj })
    }

    const handleChange2 = (e) => {
        let value = e.target.value && JSON.parse(e.target.value);

        if (e.target.name === 'fromValidator')
            setFromValAddress(e.target.value)
        if (e.target.name === 'toValidator')
            setToValAddress(e.target.value)

        obj[e.target.name] = value?.value;
        setObj({ ...obj })
    }

    useEffect(() => {
        let address = multisigAddress?.address;
        let lcdUrl = chainInfo?.config?.rest;
        dispatch(getDelegatorValidators({ lcdUrl, delegatorAddress: address }))
    }, [])

    return (
        <form onSubmit={(e) => handleSubmit(e, obj)}>
            <br /><br />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                    Select Validator
                </InputLabel>
                <Select
                    name="fromValidator"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={fromValAddress}
                    label="Select Validator"
                    onChange={handleChange2}
                >
                    {
                        dValidators.map((v, k) =>
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

export default UnDelegation_Form