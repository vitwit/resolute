import { customMUITextFieldStyles } from '@/utils/commonStyles';
import { TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

const GranteeAddressField = ({
  error,
  control,
}: {
  error: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
}) => {
  return (
    <div className="w-full relative">
      <div className="py-[6px] mb-2">Grantee Address</div>
      <Controller
        name="grantee_address"
        control={control}
        rules={{}}
        render={({ field }) => (
          <TextField
            className="bg-[#FFFFFF0D] rounded-2xl"
            {...field}
            fullWidth
            required
            size="small"
            autoFocus={true}
            placeholder="Grantee Address"
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

export default GranteeAddressField;
