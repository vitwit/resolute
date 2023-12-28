import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { resetDeleteTxnState } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import {
  CLOSE_ICON_PATH,
  DELETE_TXN_DIALOG_IMAGE_PATH,
} from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface DialogDeleteTxnProps {
  open: boolean;
  onClose: () => void;
  deleteTx: () => void;
}

const DialogDeleteTxn: React.FC<DialogDeleteTxnProps> = (props) => {
  const { open, onClose, deleteTx } = props;
  const dispatch = useAppDispatch();
  const deleteTxnStatus = useAppSelector(
    (state: RootState) => state.multisig.deleteTxnRes.status
  );

  useEffect(() => {
    if (deleteTxnStatus === TxStatus.IDLE) onClose();
  }, [deleteTxnStatus]);

  useEffect(() => {
    dispatch(resetDeleteTxnState());
  }, []);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-10 flex gap-16 pr-10 pl-6 items-center">
            <Image
              src={DELETE_TXN_DIALOG_IMAGE_PATH}
              height={238}
              width={288}
              alt="Delete Txn"
            />
            <div className="flex flex-col gap-10 w-full">
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold leading-normal">
                  Delete Transaction
                </h2>
                <div className="font-light text-[14px]">
                  Are you sure you want to delete this transaction ? This action
                  cannot be undone
                </div>
                <div className="mt-10 flex gap-10 items-center">
                  <button
                    type="submit"
                    className="create-account-btn"
                    onClick={deleteTx}
                    disabled={deleteTxnStatus === TxStatus.PENDING}
                  >
                    {deleteTxnStatus === TxStatus.PENDING
                      ? 'Loading'
                      : 'Delete'}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default DialogDeleteTxn;
