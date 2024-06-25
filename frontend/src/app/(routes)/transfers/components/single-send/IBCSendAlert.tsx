import { useAppSelector } from '@/custom-hooks/StateHooks';
import Image from 'next/image';
import React from 'react';

const IBCSendAlert = () => {
  const showIBCSendAlert = useAppSelector(
    (state) => state.bank.showIBCSendAlert
  );
  return (
    <>
      {showIBCSendAlert ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image
              src="/images/ibc-send-alert.png"
              alt="ibc-send-alert"
              width={300}
              height={300}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IBCSendAlert;
