import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AuthzExecLoader = ({ chainIDs }: { chainIDs: string[] }) => {
  const authz = useAppSelector((state) => state.authz.chains);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let isLoading = false;
    chainIDs.forEach((chainID) => {
      isLoading =
        isLoading ||
        (authz[chainID]?.tx?.status || TxStatus.INIT) === TxStatus.PENDING;
    });
    setLoading(isLoading);
  }, [chainIDs, authz]);
  return (
    <Dialog
      open={loading}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: '#ffffff1a',
        },
      }}
      sx={{
        backdropFilter: "blur(2px)"
      }}
    >
      <DialogContent>
        <div className="flex gap-4 items-center">
          <CircularProgress size={32} sx={{ color: 'white' }} />
          <div className="text-white">
            {' '}
            <span className="italic">An authz transaction is pending</span>
            <span className="dots-flashing"></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthzExecLoader;
