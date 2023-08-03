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
import { getDelegations } from "../../features/staking/stakeSlice";

function ProposalUnDelegateForm({ chainInfo, handleMsgChange, type, address }) {
  var [data, setData] = useState([]);
  const dispatch = useDispatch();

  const denom = chainInfo?.config?.currencies?.[0]?.coinDenom || "";
  const [obj, setObj] = useState({
    typeUrl: type,
    delegatorAddress: address,
  });

  var validators = useSelector((state) => state.staking.validators);
  validators = validators?.active || {};

  useEffect(() => {
    dispatch(
      getDelegations({
        baseURL: chainInfo.config.rest,
        address: address,
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
          name="address"
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

export default ProposalUnDelegateForm;
