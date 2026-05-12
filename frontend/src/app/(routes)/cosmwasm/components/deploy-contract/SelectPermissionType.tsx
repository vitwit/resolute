import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import { AccessType } from 'cosmjs-types/cosmwasm/wasm/v1/types';
import { customSelectStyles } from '@/utils/commonStyles';

interface SelectPermissionTypeI {
  handleAccessTypeChange: (event: SelectChangeEvent<AccessType>) => void;
  accessType: AccessType;
}

const SelectPermissionType = (props: SelectPermissionTypeI) => {
  const { handleAccessTypeChange, accessType } = props;
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
          className="bg-transparent border-[1px] border-[#ffffff14]"
          id="tx-type"
          value={accessType}
          onChange={handleAccessTypeChange}
          fullWidth
          sx={{
            ...customSelectStyles,
            '& .MuiSelect-select': {
              color: '#fffffff0',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#FFFFFF14',
                backdropFilter: 'blur(15px)',
                color: '#fffffff0',
                borderRadius: '16px',
                marginTop: '8px',
              },
            },
          }}
        >
          <MenuItem value={AccessType.ACCESS_TYPE_EVERYBODY}>
            Anyone can instantiate (Everybody)
          </MenuItem>
          <MenuItem value={AccessType.ACCESS_TYPE_NOBODY}>
            Instantiate through governance only (Nobody)
          </MenuItem>
          <MenuItem value={AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}>
            Only a set of addresses (Any of Addresses)
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectPermissionType;
