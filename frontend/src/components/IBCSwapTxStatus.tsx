import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  resetTx,
  resetTxDestSuccess,
  resetTxStatus,
} from '@/store/features/swaps/swapsSlice';
import { TxStatus } from '@/types/enums';
import {
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const IBCSwapTxStatus = () => {
  const dispatch = useAppDispatch();
  const [showTxSourceSuccess, setTxSourceSuccess] = useState(false);
  const [showTxDestSuccess, setTxDestSuccess] = useState(false);
  const txLoadRes = useAppSelector((state) => state.swaps.txStatus.status);
  const txHash = useAppSelector((state) => state.swaps.txSuccess.txHash);
  const txDestStatus = useAppSelector(
    (state) => state.swaps.txDestSuccess.status
  );

  useEffect(() => {
    if (txHash?.length) {
      setTxSourceSuccess(true);
    } else {
      setTxSourceSuccess(false);
    }
  }, [txHash]);

  useEffect(() => {
    if (txDestStatus.length) {
      setTxDestSuccess(true);
    } else {
      setTxDestSuccess(false);
    }
  }, [txDestStatus]);

  useEffect(() => {
    dispatch(resetTxStatus());
    dispatch(resetTxDestSuccess());
  }, []);

  return (
    <div>
      <Snackbar
        open={txLoadRes === TxStatus.PENDING}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ top: '200px' }}
      >
        <Alert
          iconMapping={{
            info: <CircularProgress size={35} sx={{ color: '#FFF' }} />,
          }}
          onClose={() => {
            dispatch(resetTx());
          }}
          severity="info"
          sx={{
            width: '100%',
            backgroundColor: '#0B071D',
            borderRadius: '8px',
            border: '1px solid #ffffffD0',
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(resetTx());
              }}
              sx={{ color: '#fff' }} // Set your desired close icon color here
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: '600', color: '#fff' }}>
            Transaction Pending...
          </AlertTitle>
          {showTxSourceSuccess ? (
            <>
              <AlertTitle
                className="flex justify-center items-center"
                sx={{ color: '#fff' }}
              >
                <div className="flex-center-center gap-1">
                  <CheckCircleRoundedIcon
                    sx={{ color: 'green', fontSize: '20px' }}
                  />
                  <div className="text-[#ffffff]">
                    Transaction Broadcasted on Source Chain
                  </div>
                </div>
              </AlertTitle>
              <Link
                className="text-[#ffffffa2] underline underline-offset-1"
                target="_blank"
                href={``}
                color="inherit"
              >
                View on explorer
              </Link>
            </>
          ) : null}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showTxDestSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ top: '200px' }}
        autoHideDuration={3000}
      >
        <Alert
          iconMapping={{
            info: (
              <TaskAltOutlinedIcon sx={{ fontSize: '35px', color: 'green' }} />
            ),
          }}
          onClose={() => {
            setTxDestSuccess(false);
          }}
          severity="info"
          sx={{
            width: '100%',
            backgroundColor: '#0B071D',
            borderRadius: '8px',
            border: '1px solid #ffffffD0',
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(resetTx());
              }}
              sx={{ color: '#fff' }} // Set your desired close icon color here
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: '600', color: '#fff' }}>
            Transaction Successful
          </AlertTitle>
          <Link
            className="text-[#ffffffa2] underline underline-offset-1"
            target="_blank"
            href={``}
            color="inherit"
          >
            View on explorer
          </Link>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default IBCSwapTxStatus;
