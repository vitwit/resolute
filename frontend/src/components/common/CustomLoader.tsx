import { CircularProgress } from '@mui/material';
import React from 'react';

interface CustomLoaderProps {
  size?: number;
  loadingText?: string;
  textStyles?: string;
}

const SIZE = 24;

const CustomLoader = ({
  size = SIZE,
  loadingText,
  textStyles,
}: CustomLoaderProps) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <CircularProgress size={size} sx={{ color: 'white' }} />
      {loadingText ? (
        <span>
          <span className={textStyles}></span>
          <span className="dots-flashing"></span>
        </span>
      ) : null}
    </div>
  );
};

export default CustomLoader;
