import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';

const ValidatorsLoading = () => {
  const validatorsLoadingCount = useAppSelector(
    (state) => state.staking.validatorsLoading
  );
  return (
    <>
      {validatorsLoadingCount > 0 ? (
        <div className="w-full space-y-1">
          <div className="h-16 bg-[#ffffff14] animate-pulse w-full"></div>
          <div className="h-16 bg-[#ffffff14] animate-pulse w-full"></div>
        </div>
      ) : null}
    </>
  );
};

export default ValidatorsLoading;
