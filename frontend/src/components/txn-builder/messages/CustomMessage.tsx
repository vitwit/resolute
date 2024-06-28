import {
  customMessageValueFieldStyles,
  customMUITextFieldStyles,
} from '@/app/(routes)/multiops/styles';
import { CUSTOM_MSG_VALUE_PLACEHOLDER } from '@/constants/txn-builder';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const CustomMessage = ({
  control,
  index,
  remove,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  control: any;
  index: number;
  remove: (index: number) => void;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
      <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="text-b1">Custom Message</div>
        <div
          className="secondary-btn cursor-pointer"
          onClick={() => remove(index)}
        >
          Remove
        </div>
      </div>
      <div className="space-y-6 px-6 pb-6">
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Enter Type URL</div>
          <Controller
            name={`msgs.${index}.typeUrl`}
            control={control}
            render={({ field }) => (
              <TextField
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                {...field}
                sx={{
                  ...customMUITextFieldStyles,
                }}
                placeholder="Eg:  /cosmos.bank.v1beta1.MsgSend"
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
        <div className="flex-1 space-y-2">
          <div className="text-b1-light">Enter Value</div>
          <Controller
            name={`msgs.${index}.value`}
            control={control}
            rules={{
              validate: (value) => {
                try {
                  JSON.parse(value);
                  return true;
                  /* eslint-disable @typescript-eslint/no-explicit-any */
                } catch (error: any) {
                  dispatch(
                    setError({
                      type: 'error',
                      message: error?.message || 'Invalid value',
                    })
                  );
                  return false;
                }
              },
            }}
            render={({ field }) => (
              <TextField
                className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                {...field}
                sx={{
                  ...customMessageValueFieldStyles,
                  ...{ height: '110px' },
                }}
                rows={4}
                multiline
                placeholder={CUSTOM_MSG_VALUE_PLACEHOLDER}
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

export default CustomMessage;
