import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import { expirationFieldStyles } from '../styles';

const ExpirationField = ({
  control,
  msg,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  msg: string;
}) => {
  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

  return (
    <Controller
      name={msg + '.expiration'}
      control={control}
      rules={{ required: 'Expiration is required' }}
      defaultValue={expiration}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            disablePast
            renderInput={(props) => (
              <TextField
                className="bg-[#FFFFFF1A] rounded-2xl w-full"
                fullWidth
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
  );
};

export default ExpirationField;
