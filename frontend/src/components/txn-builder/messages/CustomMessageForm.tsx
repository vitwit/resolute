import {
  customMessageValueFieldStyles,
  customMUITextFieldStyles,
} from '@/app/(routes)/multiops/styles';
import { CUSTOM_MSG_VALUE_PLACEHOLDER } from '@/constants/txn-builder';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

interface CustomMessageProps {
  onAddMsg: (payload: Msg) => void;
  cancelAddMsg: () => void;
}

const CustomMessageForm = (props: CustomMessageProps) => {
  const { onAddMsg, cancelAddMsg } = props;
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    reset
  } = useForm({
    defaultValues: {
      typeUrl: '',
      value: '',
    },
  });

  const onSubmit = (data: { typeUrl: string; value: string }) => {
    try {
      const msg: Msg = {
        typeUrl: data.typeUrl,
        value: JSON.parse(data.value),
      };

      onAddMsg(msg);
      reset();
    } catch (_) {
      dispatch(setError({ type: 'error', message: 'Invalid input for value' }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full"
    >
      <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
        <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="text-b1">Custom Message</div>
          <button
            className="secondary-btn"
            onClick={cancelAddMsg}
            type="button"
          >
            Remove
          </button>
        </div>
        <div className="space-y-6 px-6 pb-6">
          <div className="flex-1 space-y-2">
            <div className="text-b1-light">Enter Type URL</div>
            <Controller
              name="typeUrl"
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
              name="value"
              control={control}
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
      <div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </form>
  );
};

export default CustomMessageForm;
