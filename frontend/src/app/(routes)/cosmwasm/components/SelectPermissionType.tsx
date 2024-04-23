import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { selectTxnStyles } from '../styles';
import { AccessType } from 'cosmjs-types/cosmwasm/wasm/v1/types';

const SelectPermissionType = ({
  handleAccessTypeChange,
  accessType,
}: {
  handleAccessTypeChange: (event: SelectChangeEvent<AccessType>) => void;
  accessType: AccessType;
}) => {
  return (
    <div className="space-y-2 w-full">
      <FormControl
        fullWidth
        sx={{
          '& .MuiFormLabel-root': {
            display: 'none',
          },
        }}
      >
        <Select
          labelId="tx-type"
          className="bg-[#FFFFFF0D]"
          id="tx-type"
          value={accessType}
          onChange={handleAccessTypeChange}
          fullWidth
          sx={selectTxnStyles}
        >
          <MenuItem value={AccessType.ACCESS_TYPE_EVERYBODY}>
            Anyone can instantiate (Everybody)
          </MenuItem>
          <MenuItem value={AccessType.ACCESS_TYPE_NOBODY}>
            Instantiate through governance only (Nobody)
          </MenuItem>
          {/* TODO: Allow user to enter specific addresses  */}
          {/* <MenuItem value={AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}>
            Only a set of addresses (Any of Addresses)
          </MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectPermissionType;
