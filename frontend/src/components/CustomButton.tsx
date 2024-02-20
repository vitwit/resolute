import { isMetaMaskWallet } from '@/utils/localStorage';
import { CircularProgress, Tooltip } from '@mui/material';
import React from 'react';

const CustomSubmitButton = ({
  pendingStatus,
  circularProgressSize,
  buttonStyle,
  buttonContent,
  isIBC
}: {
  pendingStatus: boolean;
  circularProgressSize: number;
  buttonStyle: string;
  buttonContent: string;
  isIBC?:boolean;
}) => {
  const isMetaMask = isMetaMaskWallet();

  return (
    <div>
      <Tooltip
        title={(isIBC && isMetaMask) ? 'Metamask does not support IBC' : ''}
        placement="top-end"
      >
        <button disabled={pendingStatus || (isIBC && isMetaMask)}
          type="submit" className={buttonStyle}>
          {pendingStatus ? (
            <CircularProgress size={circularProgressSize} />
          ) : (
            <>{buttonContent}</>
          )}
        </button>
      </Tooltip>

    </div>
  );
};

interface propsToAccept {
  pendingStatus: boolean;
  circularProgressSize: number;
  buttonStyle: string;
  buttonContent: string;
  onClick: () => void;
}

export const CustomButton: React.FC<propsToAccept> = ({
  pendingStatus,
  circularProgressSize,
  buttonStyle,
  buttonContent,
  onClick,
}: propsToAccept) => {
  return (
    <button className={buttonStyle} onClick={onClick}>
      {pendingStatus ? (
        <CircularProgress size={circularProgressSize} />
      ) : (
        <>{buttonContent}</>
      )}
    </button>
  );
};

export default CustomSubmitButton;
