import { CircularProgress } from '@mui/material';
import React from 'react';

const CustomSubmitButton = ({
  pendingStatus,
  circularProgressSize,
  buttonStyle,
  buttonContent,
}: {
  pendingStatus: boolean;
  circularProgressSize: number;
  buttonStyle: string;
  buttonContent: string;
}) => {
  return (
    <div>
      <button type="submit" className={buttonStyle}>
        {pendingStatus ? (
          <CircularProgress size={circularProgressSize} />
        ) : (
          <>{buttonContent}</>
        )}
      </button>
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
