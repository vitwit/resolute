import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { Alert, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

const CustomAlertBar = () => {
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const showSnack = (value: boolean) => setSnackOpen(value);
  const commonState = useAppSelector((state: RootState) => state.common);
  const errState = commonState.errState;

  useEffect(() => {
    if (errState?.message?.length > 0 && errState?.type?.length > 0) {
      showSnack(true);
    } else {
      showSnack(false);
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
          autoHideDuration={3000}
          onClose={() => showSnack(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            variant="filled"
            onClose={() => showSnack(false)}
            severity={errState.type === 'success' ? 'success' : 'error'}
          >
            {errState.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default CustomAlertBar;
