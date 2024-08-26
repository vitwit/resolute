import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import { assetsDropDownStyle } from '../../styles';
import { customTransferTextFieldStyles } from '@/app/(routes)/transfers/styles';
import Image from 'next/image';
import { ADD_ICON } from '@/constants/image-names';

const UploadWasmRight = () => {
  const [attachPermissionType, setAttachPermissionType] = useState('everyone');
  const handleattachPermissionTypeChange = (
    event: SelectChangeEvent<string>
  ) => {
    setAttachPermissionType(event.target.value);
  };

  return (
    <div className="w-[50%] space-y-6">
      <div className="space-y-1">
        <div className="text-b1-light">Select Instantiate Permission</div>
        <div className="flex flex-col gap-4 text-b1">
          <Select
            labelId="tx-type"
            className="bg-[#FFFFFF0D] w-full"
            id="tx-type"
            value={attachPermissionType}
            label="Select Transaction"
            onChange={(evt) => {
              // console.log('event is triggered', evt.target.value);

              handleattachPermissionTypeChange(evt);
            }}
            sx={assetsDropDownStyle}
          >
            <MenuItem value={'everyone'}>
              Anyone can instantiate (everyone)
            </MenuItem>
            <MenuItem value={'nobody'}>
              Instantiate through governance only (nobody)
            </MenuItem>
            <MenuItem value={'addresses'}>
              Only a set of addresses (any of addresses)
            </MenuItem>
          </Select>
        </div>
      </div>

      {attachPermissionType === 'addresses' && (
        <>
          <div className="space-y-1">
            <div className="text-b1-light">Address</div>
            <TextField
              className="bg-transparent rounded-full border-[1px] border-[#ffffff80]"
              placeholder=""
              required
              fullWidth
              type="text"
              sx={{
                ...customTransferTextFieldStyles,
                '& .MuiOutlinedInput-root': {
                  ...customTransferTextFieldStyles['& .MuiOutlinedInput-root'],
                  paddingLeft: '2px',
                },
              }}
            />
          </div>
          <div className="flex gap-1 items-center justify-center">
            <Image src={ADD_ICON} width={16} height={16} alt="Add-icon" />
            <p className="text-b1">Add More</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadWasmRight;
