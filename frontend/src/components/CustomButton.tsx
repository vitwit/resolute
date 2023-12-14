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
    <div>
      <button type="submit" className={buttonStyle}>
        {pendingStatus === TxStatus.PENDING ? (
          <CircularProgress size={circularProgressSize} />
        ) : (
          <>{buttonContent}</>
        )}
      </button>
    </div>
  );
};

interface propsToAccept {
  pendingStatus: TxStatus;
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
      {pendingStatus === TxStatus.PENDING ? (
        <CircularProgress size={circularProgressSize} />
      ) : (
        <>{buttonContent}</>
      )}
    </button>
  );
};

export default CustomSubmitButton;
