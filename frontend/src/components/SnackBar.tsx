'use client'

import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { ALERT_HIDE_DURATION } from '@/utils/constants';
import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

const SnackBar = () => {
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const commonState = useAppSelector((state: RootState) => state.common);
  const errState = commonState.errState;

  const handleClose = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    if (errState?.message?.length > 0 && errState?.type?.length > 0) {
      setSnackOpen(true);
    } else {
      setSnackOpen(false);
    }
  }, [errState]);
  return (
    <>
      {errState?.message?.length > 0 && (
        <Snackbar
          open={
            snackOpen &&
            errState?.message?.length > 0 &&
            errState?.type?.length > 0
          }
          autoHideDuration={ALERT_HIDE_DURATION}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            variant="filled"
            onClose={handleClose}
            severity={errState.type === 'success' ? 'success' : 'error'}
          >
            {errState.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default SnackBar;
