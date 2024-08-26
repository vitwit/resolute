import { multiSendInputFieldStyles } from '@/app/(routes)/transfers/styles';
import { TextField } from '@mui/material';
import React from 'react';

const UseExistingCodeRight = ({ msgs }: { msgs: Msg[] }) => {
  return (
    <div className="w-[50%] space-y-1">
      <p className="text-b1-light">Instantiate message</p>
      <div className="relative">
        <TextField
          multiline
          fullWidth
          className="text-[#fffffff0]"
          rows={12}
          sx={{
            ...multiSendInputFieldStyles,
            ...{ height: msgs.length ? '90px' : '190px' },
          }}
          placeholder=""
          autoFocus={true}
        />
        <button
          type="button"
          className="primary-btn !px-6 absolute top-4 right-4 z-100"
        >
          Format JSON
        </button>
      </div>
    </div>
  );
};

export default UseExistingCodeRight;
