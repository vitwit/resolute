import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getValidators } from "../../features/staking/stakeSlice";

function ProposalReDelegateForm({
  chainInfo,
  handleMsgChange,
  type,
  fromAddress,
}) {
  var [data, setData] = useState([]);
  const dispatch = useDispatch();

  const denom = chainInfo?.config?.currencies?.[0]?.coinDenom || "";
  const [obj, setObj] = useState({
    typeUrl: type,
    delegatorAddress: fromAddress,
  });

  var validators = useSelector((state) => state.staking.validators);
  validators = validators?.active || {};

  useEffect(() => {
    dispatch(
      getValidators({
        baseURL: chainInfo.config.rest,
        status: null,
      })
    );
  }, []);

  useEffect(() => {
    data = [];
    Object.entries(validators).map(([k, v], index) => {
      let obj1 = {
        value: k,
        label: v?.description?.moniker || k,
      };

      data = [...data, obj1];
    });

    setData([...data]);
  }, [validators]);

  const handleChange = (e) => {
    obj[e.target.name] = e.target.value;
    setObj({ ...obj });
  };

  const onSubmit = () => {
    handleMsgChange(obj);
  };

  return (
    <Box>
      <FormControl fullWidth>
        <TextField
          name="fromAddress"
          value={obj?.delegatorAddress}
          disabled
          fullWidth
          sx={{
            mt: 1.5,
          }}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1.5 }}>
        <InputLabel id="demo-simple-select-label">Select Validator</InputLabel>
        <Select
          name="validatorAddress"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={obj?.valAddress}
          label="Select Validator"
          onChange={handleChange}
        >
          {data.map((v, k) => (
            <MenuItem value={JSON.stringify(v)}>{v.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <TextField
          name="amount"
          value={obj?.amount}
          onChange={handleChange}
          label="Amount"
          fullWidth
          sx={{
            mt: 1.5,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">{denom}</InputAdornment>
            ),
          }}
        />
      </FormControl>
      <Button sx={{ m: 2 }} variant="contained" onClick={onSubmit}>
        Add
      </Button>
    </Box>
  );
}

export default ProposalReDelegateForm;
