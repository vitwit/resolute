import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { resetTx, resetTxDestSuccess } from '@/store/features/swaps/swapsSlice';
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
import { cleanURL } from '@/utils/util';

const IBCSwapTxStatus = () => {
  const dispatch = useAppDispatch();
  const [showTxSourceSuccess, setTxSourceSuccess] = useState(false);
  const [showTxDestSuccess, setTxDestSuccess] = useState(false);
  const txLoadRes = useAppSelector((state) => state.swaps.txStatus.status);
  const txHash = useAppSelector((state) => state.swaps.txSuccess.txHash);
  const explorerUrl = useAppSelector((state) => state.swaps.explorerEndpoint);
  const txDestStatus = useAppSelector((state) => state.swaps.txDestSuccess);

  useEffect(() => {
    if (txHash?.length) {
      setTxSourceSuccess(true);
    } else {
      setTxSourceSuccess(false);
    }
  }, [txHash]);

  useEffect(() => {
    if (txDestStatus.status.length) {
      setTxDestSuccess(true);
    } else {
      setTxDestSuccess(false);
    }
  }, [txDestStatus]);

  useEffect(() => {
    dispatch(resetTx());
    dispatch(resetTxDestSuccess());
  }, []);

  return (
    <div>
      <Snackbar
        open={txLoadRes === TxStatus.PENDING}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ top: '100px' }}
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
            backgroundColor: '#09090a',
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
              sx={{ color: '#fff' }}
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
                href={`${cleanURL(explorerUrl)}/${txHash}`}
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
        style={{ top: '100px' }}
        autoHideDuration={3000}
      >
        <Alert
          iconMapping={{
            info: (
              <TaskAltOutlinedIcon sx={{ fontSize: '35px', color: 'green' }} />
            ),
          }}
          onClose={() => {
            dispatch(resetTxDestSuccess());
          }}
          severity="info"
          sx={{
            width: '100%',
            backgroundColor: '#09090a',
            borderRadius: '8px',
            border: '1px solid #ffffffD0',
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(resetTxDestSuccess());
              }}
              sx={{ color: '#fff' }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: '600', color: '#fff' }}>
            {txDestStatus.msg || ''}
          </AlertTitle>
          <Link
            className="text-[#ffffffa2] underline underline-offset-1"
            target="_blank"
            href={`${cleanURL(explorerUrl)}/${txHash}`}
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
