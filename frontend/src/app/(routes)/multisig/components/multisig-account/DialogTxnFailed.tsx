import CustomDialog from '@/components/common/CustomDialog';
import React from 'react';

const DialogTxnFailed = ({
  onClose,
  open,
  errMsg,
}: {
  open: boolean;
  onClose: () => void;
  errMsg: string;
}) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Transaction Failed"
      styles="w-[800px]"
    >
      <div className="p-4 rounded-2xl bg-[#FFFFFF09] font-extralight text-[14px] text-red-400">
        {errMsg}
      </div>
    </CustomDialog>
  );
};

export default DialogTxnFailed;
