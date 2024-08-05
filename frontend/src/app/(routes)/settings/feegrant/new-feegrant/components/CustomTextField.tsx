import { TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { customTextFieldStyles } from '@/utils/commonStyles';

const CustomTextField = ({
  error,
  control,
  name,
  title,
}: {
  error: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  name: string;
  title: string;
}) => {
  return (
    <div className="w-full relative">
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            const amount = Number(value);
            if (value?.length && (Number.isNaN(amount) || amount <= 0))
              return 'Invalid input';
          },
        }}
        render={({ field }) => (
          <TextField
            className="rounded-2xl"
            {...field}
            fullWidth
            required
            size="small"
            placeholder={title}
            sx={customTextFieldStyles}
          />
        )}
      />
      <div className="error-box absolute right-0">
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
