import CustomButton from '@/components/common/CustomButton';
import { REPEAT_ICON } from '@/constants/image-names';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { resetCreateTxnState } from '@/store/features/multisig/multisigSlice';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';

const DialogRepeatTxn = ({
  confirmRepeat,
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
  confirmRepeat: () => void;
}) => {
  const dispatch = useAppDispatch();
  const createRes = useAppSelector((state) => state.multisig.createTxnRes);

  useEffect(() => {
    if (createRes?.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: createRes?.error,
        })
      );
      dispatch(resetCreateTxnState());
      onClose();
    } else if (createRes?.status === 'idle') {
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction created',
        })
      );
      dispatch(resetCreateTxnState());
      onClose();
    }
  }, [createRes]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="p-10 pb-14 space-y-6 w-[450px]">
          <div className="flex justify-end px-6">
            <button onClick={onClose} className="text-btn !h-8">
              Close
            </button>
          </div>
          <div className="flex flex-col items-center gap-10">
            <Image src={REPEAT_ICON} width={60} height={60} alt="" />
            <div className="flex flex-col items-center gap-2">
              <div className="text-[18px] font-semibold">
                Repeat Transaction
              </div>
              <div className="text-[14px] text-[#ffffff80]">
                Are you sure you want to repeat this transaction ?
              </div>
            </div>
          </div>
          <CustomButton
            btnText="Repeat Transaction"
            btnOnClick={confirmRepeat}
            btnLoading={createRes.status === 'pending'}
            btnDisabled={createRes.status === 'pending'}
            btnStyles="mx-auto w-[164px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogRepeatTxn;
