import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { TextField, MenuItem, Select } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const DelegateMessage = ({
  control,
  index,
  remove,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: any;
  index: number;
  remove: (index: number) => void;
}) => {
  return (
    <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
      <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="text-b1">Delegate</div>
        <div className="secondary-btn" onClick={() => remove(index)}>
          Remove
        </div>
      </div>
      <div className="flex items-center gap-6 px-6 pb-6">
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Select Validator</div>
          <Controller
            name={`msgs.${index}.option`}
            control={control}
            render={({ field }) => (
              <Select
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                {...field}
                sx={{
                  ...customMUITextFieldStyles,
                }}
                fullWidth
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="option1">Option 1</MenuItem>
                <MenuItem value="option2">Option 2</MenuItem>
              </Select>
            )}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Enter Amount</div>
          <Controller
            name={`msgs.${index}.amount`}
            control={control}
            render={({ field }) => (
              <TextField
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                {...field}
                sx={{
                  ...customMUITextFieldStyles,
                }}
                placeholder="Enter amount"
                fullWidth
                InputProps={{
                  sx: {
                    input: {
                      color: 'white',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DelegateMessage;
