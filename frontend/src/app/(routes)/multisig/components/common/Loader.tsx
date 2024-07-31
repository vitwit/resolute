import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React from 'react';

const Loader = () => {
  const signTxStatus = useAppSelector(
    (state) => state.multisig.signTransactionRes
  );
  const broadcastTxnStatus = useAppSelector(
    (state) => state.multisig.broadcastTxnRes
  );
  const signTxLoading = signTxStatus.status === TxStatus.PENDING;
  const broadcastTxnLoading = broadcastTxnStatus.status === TxStatus.PENDING;

  return (
    <Dialog
      open={broadcastTxnLoading || signTxLoading}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: '#ffffff1a',
        },
      }}
      sx={{
        backdropFilter: 'blur(2px)',
      }}
    >
      <DialogContent>
        <div className="flex gap-4 items-center">
          <CircularProgress size={32} sx={{ color: 'white' }} />
          <div className="">
            <span className="italic text-[#fffffff0]">Loading</span>
            <span className="dots-flashing"></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Loader;
