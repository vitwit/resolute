import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { parseBalance } from '@/utils/denom';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const DepositProposalInfo = ({ chainID }: { chainID: string }) => {
  const currency = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID]?.network.config.currencies[0]
  );
  const depositParams = useAppSelector(
    (state: RootState) => state.gov.chains[chainID]?.depositParams.params
  );
  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
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
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      const total_deposit = parseBalance(
        proposalInfo.total_deposit,
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      const deposit_percent = Math.floor((total_deposit / min_deposit) * 100);
      setMinDeposit(min_deposit);
      setTotalDeposit(total_deposit);
      setDepositPercent(deposit_percent);
    }
  }, [depositParams, proposalInfo]);

  return (
    <div className="voting-grid w-full">
      <div className="voting-view w-full">
        <div className="status-pass w-full">
          <div className="flex flex-col items-center space-y-2 w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 flex justify-center items-center">
                <Image
                  src="/vote-icon.svg"
                  width={20}
                  height={20}
                  alt="Vote-Icon"
                />
              </div>
              <p className="text-[14px]">Deposit Collected</p>
            </div>
            <div>
              <p className="font-bold text-[20px]">
                {totalDeposit}/{minDeposit} {currency.coinDenom}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex">
            <div style={{ width: `${depositPercent.toString()}%` }}></div>
            <div className="flex flex-col items-center">
              <div>{depositPercent}%</div>
              <div className="bg-[#26233C] h-[10px] w-[1px]"></div>
            </div>
          </div>
          <div className="bg-[#FFFFFF1A] w-full h-[10px] rounded-full">
            <div
              style={{ width: `${depositPercent.toString()}%` }}
              className={`bg-[#2DC5A4] h-[10px] rounded-l-full`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositProposalInfo;
