import React from 'react';
import CustomDialog from '../../../../components/common/CustomDialog';
import { TextField } from '@mui/material';
import { customTransferTextFieldStyles } from '../../transfers/styles';

const DialogAddAddress = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <CustomDialog
      open={open}
      title="Add Address"
      onClose={onClose}
      styles="w-[800px]"
      description="Connect your wallet now to access all the modules on resolute "
    >
      <div className="space-y-6 w-full">
        <div className="gap-1">
          <div className="form-label-text">Name</div>
          <TextField
            className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
            fullWidth
            type="text"
            sx={customTransferTextFieldStyles}
          />
        </div>
        <div className="gap-1">
          <div className="form-label-text">Address</div>
          <TextField
            className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
            fullWidth
            type="text"
            sx={customTransferTextFieldStyles}
          />
        </div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </CustomDialog>
  );
};

export default DialogAddAddress;
