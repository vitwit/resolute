import React from 'react';
import { CircularProgress } from '@mui/material';

const PageLoading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div>
        <CircularProgress sx={{ color: '#ffffffad' }} size={24} />
      </div>
    </div>
  );
};

export default PageLoading;
