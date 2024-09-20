import { useAppSelector } from '@/custom-hooks/StateHooks';
import { IBC_SEND_ALERT } from '@/utils/constants';
import Image from 'next/image';
import React from 'react';

const IBCSendAlert = () => {
  const showIBCSendAlert = useAppSelector(
    (state) => state.bank.showIBCSendAlert
  );
  return (
    <>
      {showIBCSendAlert ? (
        <div className="fixed w-full ml-[-40px] bg-[#ffc13c] gap-2 px-6 py-3 flex items-center">
          <Image
            src="/infoblack.svg"
            width={24}
            height={24}
            alt="info-icon"
            draggable={false}
          />
          <p className="text-[#1C1C1D] text-sm font-semibold leading-[normal]">
            Important
          </p>
          <p className="text-[#1C1C1D] text-sm font-normal leading-[normal]">
            {IBC_SEND_ALERT}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default IBCSendAlert;
