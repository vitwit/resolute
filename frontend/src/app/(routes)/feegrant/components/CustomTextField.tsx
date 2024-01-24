import { TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { customMUITextFieldStyles } from '@/utils/commonStyles';

const CustomTextField = ({
  error,
  control,
  name,
}: {
  error: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  name: string;
}) => {
  return (
    <div className="w-full relative">
      <div className="py-[6px] mb-2">Spend Limit</div>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            const amount = Number(value);
            if (value?.length && (isNaN(amount) || amount <= 0))
              return 'Invalid Amount';
          },
        }}
        render={({ field }) => (
          <TextField
            className="rounded-2xl bg-[#FFFFFF0D]"
            {...field}
            fullWidth
            required
            size="small"
            autoFocus={true}
            placeholder="Spend Limit"
            sx={customMUITextFieldStyles}
            InputProps={{
              sx: {
                input: {
                  color: 'white !important',
                  fontSize: '14px',
                  padding: 2,
                },
              },
            }}
          />
        )}
      />
      <div className="error-box absolute left-0">
        <span
          className={error ? 'error-chip opacity-80' : 'error-chip opacity-0'}
        >
          {error || ''}
        </span>
      </div>
    </div>
  );
};

export default CustomTextField;
