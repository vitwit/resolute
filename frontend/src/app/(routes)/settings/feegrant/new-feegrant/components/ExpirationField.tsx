import { TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { expirationFieldStyles } from '../../../styles';

const ExpirationField = ({
  control,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
}) => {
  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

  return (
    <div className="w-full">
      <div className="mb-2 text-[#FFFFFF80] text-[14px] font-light">
        Set Expiry
      </div>
      <Controller
        name={'expiration'}
        control={control}
        rules={{ required: 'Expiration is required' }}
        defaultValue={expiration}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              disablePast
              renderInput={(props) => (
                <TextField
                  className="bg-[#FFFFFF0D] rounded-2xl"
                  fullWidth
                  required
                  {...props}
                  sx={expirationFieldStyles}
                  error={!!error}
                  onFocus={(event) => (event.target.readOnly = true)}
                  onBlur={(event) => (event.target.readOnly = false)}
                />
              )}
              value={value}
              onChange={onChange}
            />
          </LocalizationProvider>
        )}
      />
    </div>
  );
};

export default ExpirationField;
