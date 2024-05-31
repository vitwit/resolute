import { isMetaMaskWallet } from '@/utils/localStorage';
import { CircularProgress, Tooltip } from '@mui/material';
import React from 'react';

const CustomSubmitButton = ({
  pendingStatus,
  isIBC,
}: {
  pendingStatus: boolean;
  isIBC?: boolean;
}) => {
  const isMetaMask = isMetaMaskWallet();

  return (
    <div>
      <Tooltip
        title={isIBC && isMetaMask ? 'Metamask does not support IBC' : ''}
        placement="top-end"
      >
        <button
          className="primary-btn w-full"
          disabled={pendingStatus || (isIBC && isMetaMask)}
          type="submit"
        >
          {pendingStatus ? (
            <div className="flex justify-center items-center gap-2">
              <CircularProgress size={12} sx={{ color: 'white' }} />
              <span className="italic">
                Pending<span className="dots-flashing"></span>{' '}
              </span>
            </div>
          ) : (
            'Send'
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default CustomSubmitButton;
