'use client';

import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';
import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import ValidatorName from './ValidatorName';

interface PopupProps {
  validator: string;
  chainID: string;
  openPopup: boolean;
  openDelegatePopup: () => void;
}

const DelegatePopup: React.FC<PopupProps> = ({
  validator,
  chainID,
  openPopup,
  openDelegatePopup,
}) => {
  // Local state to manage the amount and the open status of the dialog
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(openPopup);

  // Custom hook to get single staking information based on chainID
  const singleStake = useSingleStaking(chainID);

  // Get the available staking assets and denomination
  const { availableAmount } = singleStake.getStakingAssets();
  const denom = singleStake.getDenomWithChainID(chainID);

  // Custom hook to get staking information
  const staking = useStaking({ isSingleChain: true });

  // Get the current validator's information from the staking module
  const stakeModule = staking.getAllDelegations();
  const val = stakeModule[chainID]?.validators?.active?.[validator];

  // Calculate the commission rate for the validator
  const getCommisionRate = () => {
    return Number(get(val, 'commission.commission_rates.rate', 0)) * 100;
  };

  // Handler for input change to set the amount
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(Number(event.target.value));

  // Handler for quick select amount
  const onChangeAmount = (value: number) => {
    setAmount(Number((value * availableAmount).toFixed(6)));
  };

  // Function to perform the delegation transaction
  const doTxDelegate = () => {
    staking.txDelegateTx(validator, amount, chainID);
  };

  // Status of the delegation transaction
  const delegteStatus = staking.txAllChainStakeTxStatus[chainID]?.tx?.status;

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        openDelegatePopup();
        setOpen(false);
      }}
      title="Delegate"
    >
      <div className="flex flex-col w-[800px] items-center gap-6">
        {/* Validator details */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center">
            <ValidatorName
              valoperAddress={validator}
              chainID={chainID}
              smallFont
            />
          </div>
          <div className="flex justify-between w-full items-center gap-10">
            <p className="truncate flex-1 secondary-text">
              {get(val, 'description.details', '-')}
            </p>
            <p className="flex secondary-text">
              {getCommisionRate()}% Commission
            </p>
          </div>
          <div className="divider-line"></div>
        </div>

        {/* Address field for the amount */}
        <AddressField
          balanceTypeText="Available"
          denom={denom}
          onChange={onChange}
          value={amount || 0}
          availableAmount={availableAmount}
          quickSelectAmount={onChangeAmount}
        />

        {/* Staking alert */}
        <div className="staking-alert w-full">
          <div className="flex space-x-1 items-center">
            <Image
              src="/info-yellow.svg"
              width={24}
              height={24}
              alt="info-icon"
            />
            <p className="text-[#FFC13C] text-b1">Important</p>
            <p className="text-b1-light">
              Staking will lock your funds for 21 days.
            </p>
          </div>
          <div className="text-b1">
            To make your staked assets liquid, undelegation will take 21 days.
          </div>
        </div>

        {/* Delegate button */}
        <button
          disabled={!amount}
          onClick={doTxDelegate}
          className="primary-btn cursor-pointer w-full"
        >
          {delegteStatus === 'pending' ? 'Loading....' : 'Delegate'}
        </button>
      </div>
    </CustomDialog>
  );
};

export default DelegatePopup;
