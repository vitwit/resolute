import React from 'react';
import ExpirationField from './ExpirationField';
import { Control, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { expirationFieldStyles } from '../../../styles';

const SendAuthzForm = ({
  control,
  advanced,
  toggle,
  formError,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  advanced: boolean;
  toggle: () => void;
  formError: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-[12px] text-[#ffffff80] font-light">
            Set Expiry
          </div>
          <ExpirationField control={control} msg={'send'} />
        </div>
        {advanced && (
          <>
            <Controller
              name={'send.spend_limit'}
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
                  className="rounded-2xl"
                  {...field}
                  fullWidth
                  required={false}
                  size="small"
                  autoFocus={true}
                  placeholder="Spend Limit (Optional)"
                  sx={expirationFieldStyles}
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
            <div className="error-box">
              <span
                className={
                  formError?.length
                    ? 'error-chip opacity-80'
                    : 'error-chip opacity-0'
                }
              >
                {formError || ''}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={toggle} className="secondary-btn">
          Customize
        </button>
      </div>
    </div>
  );
};

export default SendAuthzForm;
