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

const UndelegatePopup: React.FC<PopupProps> = ({
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

  // Get the total staked amount and denomination
  const { totalStakedAmount } = singleStake.getStakingAssets();
  const denom = singleStake.getDenomWithChainID(chainID);

  // Custom hook to get staking information
  const staking = useStaking();

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
    setAmount(Number((value * totalStakedAmount).toFixed(6)));
  };

  // Function to perform the undelegation transaction
  const doTxUnDelegate = () => {
    staking.txUnDelegateTx(validator, amount, chainID);
  };

  // Status of the undelegation transaction
  const delegateStatus = staking.txAllChainStakeTxStatus[chainID]?.tx?.status;

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        openDelegatePopup();
        setOpen(false);
      }}
      title="Undelegate"
    >
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Validator details */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <ValidatorName valoperAddress={validator} chainID={chainID} />
          </div>
          <div className="flex justify-between w-full">
            <p>{get(val, 'description.details', '-')}</p>
            <p>{getCommisionRate()}% Commission</p>
          </div>
          <div className="divider-line"></div>
        </div>

        {/* Address field for the amount */}
        <AddressField
          balanceTypeText="Staked"
          denom={denom}
          onChange={onChange}
          value={amount || 0}
          availableAmount={totalStakedAmount}
          quickSelectAmount={onChangeAmount}
        />

        {/* Staking alert */}
        <div className="staking-alert w-full">
          <div className="flex space-x-2">
            <Image src="/info.svg" width={24} height={24} alt="info-icon" />
            <p className="text-[#FFC13C] text-b1">Important</p>
            <p className="text-b1-light">
              Staking will lock your funds for 21 days.
            </p>
          </div>
          <div className="text-b1">
            To make your staked assets liquid, undelegation will take 21 days.
          </div>
        </div>

        {/* Undelegate button */}
        <button
          disabled={!amount}
          onClick={doTxUnDelegate}
          className="primary-btn cursor-pointer w-full"
        >
          {delegateStatus === 'pending' ? 'Loading....' : 'Undelegate'}
        </button>
      </div>
    </CustomDialog>
  );
};

export default UndelegatePopup;
