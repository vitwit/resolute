import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getTotalAmount } from '@/utils/denom';
import React from 'react';

const AmountSummary = ({ msgs }: { msgs: Msg[] }) => {
  const { getOriginDenomInfo } = useGetChainInfo();
  const originDenomInfo = getOriginDenomInfo(
    msgs[0].value?.amount?.[0]?.denom || ''
  );
  const totalAmount = getTotalAmount(originDenomInfo, msgs);
  return (
    <div className="px-6 h-10 flex items-center justify-center bg-[#FFFFFF05] text-[14px] text-[#FFFFFF80] rounded-2xl w-full space-x-2">
      <span>You are sending</span>
      <span className="font-bold text-[16px]">
        {totalAmount} {originDenomInfo.originDenom}
      </span>
      <span>to</span>
      <span className="font-bold text-[16px]">
        {msgs.length} Addresses
      </span>
    </div>
  );
};

export default AmountSummary;
