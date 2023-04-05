import { Box, Button, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";

const TextFieldComponent = ({
  name,
  placeholder,
  value,
  disbled,
  onChange,
  type,
}) => (
  <FormControl sx={{ m: 1 }} fullWidth>
    <TextField
      disabled={disbled}
      fullWidth
      name={name}
      type={type || "text"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </FormControl>
);

function ProposalSendForm({ handleMsgChange, fromAddress, type }) {
  const [obj, setObj] = useState({
    typeUrl: type,
    fromAddress: fromAddress,
  });

  const handleChange = (e) => {
    obj[e.target.name] = e.target.value;
    setObj({ ...obj });
  };

  return (
    <Box>
      <TextFieldComponent
        name="fromAddress"
        onChange={handleChange}
        disbled
        placeholder={"From Address"}
        value={obj["fromAddress"]}
      />
      <TextFieldComponent
        name="toAddress"
        onChange={handleChange}
        placeholder={"To Address"}
        value={obj["toAddress"]}
      />
      <TextFieldComponent
        name="amount"
        onChange={handleChange}
        placeholder={"Amount"}
        type="number"
        value={obj?.amount?.[0]?.amount}
      />
      <Button
        variant="contained"
        onClick={() => {
          handleMsgChange(obj);
        }}
      >
        Add
      </Button>
    </Box>
  );
}

export default ProposalSendForm;
