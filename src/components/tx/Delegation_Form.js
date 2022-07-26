import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Decimal } from "@cosmjs/math";
import { calculateFee } from "@cosmjs/stargate";
import { useDispatch, useSelector } from "react-redux";
import { createTxn } from "../../features/multisig/multisigSlice";
import { fee } from "../../txns/execute";
import FeeComponent from "./FeeComponent";
import { Box } from "@mui/system";

const Delegation_Form = ({ chainInfo }) => {
  const dispatch = useDispatch();
  const currency = chainInfo.config.currencies[0];
  const [feeAmount, setFeeAmount] = useState(0);

  const onSetFeeChange = (value) => {
    setFeeAmount(
      Number(value) * 10 ** chainInfo?.config.currencies[0].coinDecimals
    );
  };

  const multisigAddress =
    (localStorage.getItem("multisigAddress") &&
      JSON.parse(localStorage.getItem("multisigAddress"))) ||
    {};

  var validators = useSelector((state) => state.staking.validators);

  validators = (validators && validators.active) || {};
  const [valAddress, setValAddress] = useState(null);
  var [data, setData] = useState([]);
  const [obj, setObj] = useState({});

  const handleChange = (e) => {
    obj[e.target.name] = e.target.value;
    setObj({ ...obj });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amountInAtomics = Decimal.fromUserInput(
      obj?.amount,
      Number(chainInfo.config.currencies[0].coinDecimals)
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

    const feeObj = fee(
      chainInfo?.config.currencies[0].coinMinimalDenom,
      feeAmount ||
        chainInfo?.config?.gasPriceStep?.average *
          10 ** chainInfo?.config.currencies[0].coinDecimals,
      300000
    );

    let delegationObj = {
      address: multisigAddress?.address,
      chainId: chainInfo?.config?.chainId,
      msgs: [msg],
      fee: feeObj,
      memo: obj?.memo,
      gas: obj?.gas,
    };

    dispatch(createTxn(delegationObj));
  };

  useEffect(() => {
    data = [];
    Object.entries(validators).map(([k, v], index) => {
      let obj1 = {
        value: k,
        label: v.description.moniker,
      };

      data = [...data, obj1];
    });

    setData([...data]);
  }, [validators]);

  const handleChange1 = (e) => {
    setValAddress(e.target.value);
    let o = JSON.parse(e.target.value);
    obj["validator_address"] = o.value;

    setObj({ ...obj });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, obj)}>
      <FormControl fullWidth sx={{ mt: 1.5 }}>
        <InputLabel id="demo-simple-select-label">Select Validator</InputLabel>
        <Select
          name="toAddress"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={valAddress}
          label="Select Validator"
          onChange={handleChange1}
        >
          {data.map((v, k) => (
            <MenuItem value={JSON.stringify(v)}>{v.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="amount"
        value={obj.amount}
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
        value={obj.gas}
        onChange={handleChange}
        label="Gas"
        fullWidth
        sx={{
          mt: 1.5,
        }}
      />
      <TextField
        name="memo"
        value={obj.memo}
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
        sx={{
          textAlign: "center",
        }}
        component="div"
      >
        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
          }}
        >
          Create
        </Button>
      </Box>
    </form>
  );
};

export default Delegation_Form;
