import { customTextFieldStyles } from '@/utils/commonStyles';
import { TextField } from '@mui/material';
import React from 'react';

const GranteeAddress = ({
  handleChange,
  value,
}: {
  value: string;
  handleChange: HandleChangeEvent;
}) => {
  return (
    <div className="space-y-2">
      <div className="text-[14px] text-[#ffffff80]">Grantee Address</div>
      <TextField
        className="rounded-2xl"
        fullWidth
        required
        value={value}
        size="small"
        onChange={handleChange}
        placeholder={'Grantee Address'}
        sx={customTextFieldStyles}
      />
    </div>
  );
};

export default GranteeAddress;
