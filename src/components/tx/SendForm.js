import { calculateFee } from '@cosmjs/stargate'
import { Button, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Decimal } from "@cosmjs/math";
import { createTxn } from '../../features/multisig/multisigSlice';
import { fee } from '../../txns/execute';

export const SendForm = ({ handleSubmit,
    chainInfo }) => {
    const dispatch = useDispatch();

    const multisigAddress = localStorage.getItem('multisigAddress')
        && JSON.parse(localStorage.getItem('multisigAddress')) || {}

    const [inputObj, setInputObj] = useState({});
    const currency = chainInfo.config.currencies[0];

    const handleSubmit1 = (e) => {
        e.preventDefault();

        const amountInAtomics = Decimal.fromUserInput(
            inputObj?.amount,
            Number(chainInfo.config.currencies[0].coinDecimals),
        ).atomics;

        const msgSend = {
            fromAddress: multisigAddress?.address,
            toAddress: inputObj?.toAddress,
            amount: [
                {
                    amount: amountInAtomics,
                    denom: chainInfo.config.currencies[0].coinMinimalDenom,
                },
            ],
        };

        const msg = {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: msgSend,
        };
        const feeObj = fee(chainInfo?.config.currencies[0].coinMinimalDenom,
            chainInfo?.config?.gasPriceStep?.average,
            300000)

        let obj = {
            chainId: chainInfo?.config?.chainId,
            msgs: [msg],
            fee: feeObj,
            memo: inputObj?.memo,
            address: multisigAddress?.address
        };

        dispatch(createTxn(obj))
    }

    const handleChange = (e) => {
        inputObj[e.target.name] = e.target.value;
        setInputObj({ ...inputObj });
    }

    return (
        <form onSubmit={handleSubmit1}>
            <TextField
                name="toAddress"
                value={inputObj.toAddress}
                onChange={handleChange}
                label="To Address"
                fullWidth
                style={{ marginTop: 8, marginBottom: 8 }}
            />
            <TextField
                name="amount" value={inputObj.amount} onChange={handleChange}
                label="Amount"
                fullWidth
                style={{ marginTop: 8, marginBottom: 8 }}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="start">{currency?.coinDenom}</InputAdornment>,
                }}
            />
            <TextField
                name="gas" value={inputObj.gas} onChange={handleChange}
                label="Gas"
                fullWidth
                style={{ marginTop: 8, marginBottom: 8 }}
            />
            <TextField
                name="memo" value={inputObj.memo} onChange={handleChange}
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

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SendForm)