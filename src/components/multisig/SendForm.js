import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Decimal } from "@cosmjs/math";
import { createTxn } from "../../features/multisig/multisigSlice";
import { fee } from "../../txns/execute";
import FeeComponent from "./FeeComponent";
import { Box } from "@mui/system";

export default function SendForm({ handleSubmit, chainInfo }) {
  const dispatch = useDispatch();

  const multisigAddress =
    (localStorage.getItem("multisigAddress") &&
      JSON.parse(localStorage.getItem("multisigAddress"))) ||
    {};

  const [inputObj, setInputObj] = useState({});
  const currency = chainInfo.config.currencies[0];

  const [feeAmount, setFeeAmount] = useState(0);

  const onSetFeeChange = (value) => {
    setFeeAmount(
      Number(value) * 10 ** chainInfo?.config.currencies[0].coinDecimals
    );
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();

    const amountInAtomics = Decimal.fromUserInput(
      inputObj?.amount,
      Number(chainInfo.config.currencies[0].coinDecimals)
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

    const feeObj = fee(
      chainInfo?.config.currencies[0].coinMinimalDenom,
      feeAmount ||
        chainInfo?.config?.gasPriceStep?.average *
          10 ** chainInfo?.config.currencies[0].coinDecimals,
      300000
    );

    let obj = {
      chainId: chainInfo?.config?.chainId,
      msgs: [msg],
      fee: feeObj,
      memo: inputObj?.memo,
      address: multisigAddress?.address,
    };

    dispatch(createTxn(obj));
  };

  const handleChange = (e) => {
    inputObj[e.target.name] = e.target.value;
    setInputObj({ ...inputObj });
  };

  return (
    <form onSubmit={handleSubmit1}>
      <TextField
        sx={{
          mt: 1.5,
        }}
        name="toAddress"
        value={inputObj.toAddress}
        onChange={handleChange}
        label="To Address"
        fullWidth
      />
      <TextField
        name="amount"
        value={inputObj.amount}
        onChange={handleChange}
        label="Amount"
        fullWidth
        sx={{
          mt: 1.5,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              {currency?.coinDenom}
            </InputAdornment>
          ),
        }}
      />
      <TextField
        name="gas"
        value={inputObj.gas}
        onChange={handleChange}
        label="Gas"
        fullWidth
        sx={{
          mt: 1.5,
        }}
      />
      <TextField
        name="memo"
        value={inputObj.memo}
        onChange={handleChange}
        label="Memo"
        fullWidth
        sx={{
          mt: 1.5,
          mb: 1,
        }}
      />

      <FeeComponent onSetFeeChange={onSetFeeChange} chainInfo={chainInfo} />
      <Box
        component="div"
        sx={{
          textAlign: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            mt: 2,
            justifyContent: "center",
            textTransform: "none",
          }}
        >
          Create
        </Button>
      </Box>
    </form>
  );
}
