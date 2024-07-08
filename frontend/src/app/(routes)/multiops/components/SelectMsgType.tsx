import { MULTIOPS_MSG_TYPES } from '@/utils/constants';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { selectTxnStyles } from '../styles';

const SelectMsgType = ({
  handleMsgTypeChange,
  msgType,
}: {
  handleMsgTypeChange: (event: SelectChangeEvent<string>) => void;
  msgType: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="text-[14px] font-extralight">Select transaction type</div>
      <FormControl
        fullWidth
        sx={{
          '& .MuiFormLabel-root': {
            display: 'none',
          },
        }}
      >
        <InputLabel className="" id="tx-type">
          Select Transaction
        </InputLabel>
        <Select
          labelId="tx-type"
          className="bg-[#FFFFFF0D]"
          id="tx-type"
          value={msgType}
          label="Select Transaction"
          onChange={handleMsgTypeChange}
          sx={selectTxnStyles}
        >
          <MenuItem value={MULTIOPS_MSG_TYPES.send}>Send</MenuItem>
          <MenuItem value={MULTIOPS_MSG_TYPES.delegate}>Delegate</MenuItem>
          <MenuItem value={MULTIOPS_MSG_TYPES.redelegate}>Redelegate</MenuItem>
          <MenuItem value={MULTIOPS_MSG_TYPES.undelegate}>Undelegate</MenuItem>
          <MenuItem value={MULTIOPS_MSG_TYPES.vote}>Vote</MenuItem>
          <MenuItem value={MULTIOPS_MSG_TYPES.deposit}>Deposit</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectMsgType;
