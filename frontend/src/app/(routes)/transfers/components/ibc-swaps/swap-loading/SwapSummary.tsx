import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';

const SwapSummary = () => {
  const selectedSourceAsset = useAppSelector(
    (state) => state.swaps.sourceAsset
  );
  const selectedDestAsset = useAppSelector((state) => state.swaps.destAsset);
  const amountIn = useAppSelector((state) => state.swaps.amountIn);
  const amountOut = useAppSelector((state) => state.swaps.amountOut);
  const isDataProvided =
    selectedSourceAsset &&
    selectedDestAsset &&
    amountIn?.length &&
    amountOut?.length;

  return (
    <div className="text-[#ffffff80]">
      {isDataProvided ? (
        <>
          You are swapping{' '}
          <span className="font-medium">
            {amountIn} {selectedSourceAsset?.symbol}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {amountOut} {selectedDestAsset?.symbol}
          </span>
        </>
      ) : (
        <>
          Provide all the required fields to continue with the transaction.
        </>
      )}
    </div>
  );
};

export default SwapSummary;
