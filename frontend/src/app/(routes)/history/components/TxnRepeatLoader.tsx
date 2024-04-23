import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React from 'react';

const TxnRepeatLoader = () => {
  const loading = useAppSelector(
    (state) => state.recentTransactions?.txnRepeat?.status
  );
  return (
    <Dialog
      open={loading === TxStatus.PENDING}
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
          <div className="text-white">
            <span className="italic">Transaction pending</span>
            <span className="dots-flashing"></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TxnRepeatLoader;
