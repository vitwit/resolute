import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { TxStatus } from '@/types/enums';
import { parseBalance } from '@/utils/denom';
import React, { useEffect, useState } from 'react';

const DepositCollected = ({
  proposalInfo,
  chainID,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  proposalInfo: any;
  chainID: string;
}) => {
  const { getDenomInfo } = useGetChainInfo();
  const { displayDenom, minimalDenom, decimals } = getDenomInfo(chainID);

  const depositParams = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.depositParams.params
  );
  const depositParamsLoading = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.depositParams?.status
  );

  const [minDeposit, setMinDeposit] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [depositPercent, setDepositPercent] = useState(0);

  useEffect(() => {
    if (
      depositParams?.min_deposit?.length &&
      proposalInfo?.total_deposit?.length
    ) {
      const min_deposit = parseBalance(
        depositParams.min_deposit,
        decimals,
        minimalDenom
      );
      const total_deposit = parseBalance(
        proposalInfo.total_deposit,
        decimals,
        minimalDenom
      );
      console.log(proposalInfo.total_deposit, decimals, minimalDenom);
      const deposit_percent = Math.floor((total_deposit / min_deposit) * 100);
      setMinDeposit(min_deposit);
      setTotalDeposit(total_deposit);
      setDepositPercent(deposit_percent);
    }
  }, [depositParams, proposalInfo]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05] min-w-[380px]">
      <div className="space-y-2">
        <p className="text-h2">Deposit Collected</p>
        <div className="divider-line"></div>
      </div>
      {minDeposit ? (
        <>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[18px] font-bold">
              {totalDeposit}/{minDeposit} {displayDenom}
            </div>
            <div className="text-[12px] text-[#ffffff80]">
              {depositPercent}% deposit collected
            </div>
          </div>
          <div className="bg-[#FFFFFF0D] w-full rounded-full">
            <div
              style={{
                width: `${depositPercent.toString()}%`,
                background:
                  'linear-gradient(90deg, #2ba472 0%, rgba(43, 164, 114, 0.5) 100%)',
              }}
              className="h-2 rounded-full"
            ></div>
          </div>
        </>
      ) : (
        <>
          {depositParamsLoading === TxStatus.PENDING ? (
            <>
              <div className="w-full h-[53px] animate-pulse bg-[#252525] rounded"></div>
              <div className="w-full h-2 animate-pulse bg-[#252525] rounded"></div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default DepositCollected;
