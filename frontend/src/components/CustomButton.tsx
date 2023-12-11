import { TxStatus } from '@/types/enums';
import { CircularProgress } from '@mui/material';
import React from 'react';

const CustomSubmitButton = ({
  pendingStatus,
  circularProgressSize,
  buttonStyle,
  buttonContent,
}: {
  pendingStatus: TxStatus;
  circularProgressSize: number;
  buttonStyle: string;
  buttonContent: string;
}) => {
  return (
    <button type="submit" className={buttonStyle}>
      {pendingStatus === TxStatus.PENDING ? (
        <CircularProgress size={circularProgressSize} />
      ) : (
        <>{buttonContent}</>
      )}
    </button>
  );
};

export const CustomButton = ({
  pendingStatus,
  circularProgressSize,
  buttonStyle,
  buttonContent,
  onClick,
}: {
  pendingStatus: TxStatus;
  circularProgressSize: number;
  buttonStyle: string;
  buttonContent: string;
  onClick: () => void;
}) => {
  return (
    <button className={buttonStyle} onClick={onClick}>
      {pendingStatus === TxStatus.PENDING ? (
        <CircularProgress size={circularProgressSize} />
      ) : (
        <>{buttonContent}</>
      )}
    </button>
  );
};

export default CustomSubmitButton;
