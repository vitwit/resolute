import { CircularProgress } from '@mui/material';
import React from 'react';

interface CustomButtonProps {
  btnText: string;
  btnStyles?: string;
  btnLoading?: boolean;
  btnDisabled?: boolean;
  btnOnClick?: any;
}

const CustomButton = ({
  btnStyles,
  btnText,
  btnLoading,
  btnDisabled,
  btnOnClick,
}: CustomButtonProps) => {
  return (
    <button
      className={`primary-btn ${btnStyles}`}
      disabled={btnDisabled}
      type="button"
      onClick={btnOnClick}
    >
      {btnLoading ? (
        <div className="flex justify-center items-center gap-2">
          <CircularProgress size={12} sx={{ color: 'white' }} />
          <span className="italic">
            Pending<span className="dots-flashing"></span>{' '}
          </span>
        </div>
      ) : (
        btnText
      )}
    </button>
  );
};

export default CustomButton;
