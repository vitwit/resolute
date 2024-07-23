'use client';

import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';
import useStaking from '@/custom-hooks/useStaking';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import useValidators from '@/custom-hooks/staking/useValidators';
import { ValidatorInfo } from '@/types/staking';
import ValidatorsAutoComplete from './ValidatorsAutoComplete';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';

interface PopupProps {
  chainID: string;
  open: boolean;
  onClose: () => void;
  selectedValidator: ValidatorInfo | null;
  handleValidatorChange: (option: ValidatorInfo | null) => void;
}

const NewDelegationDialog: React.FC<PopupProps> = ({
  chainID,
  open,
  onClose,
  handleValidatorChange,
  selectedValidator,
}) => {
  const dispatch = useAppDispatch();
  const { getValidators } = useValidators();
  const { validatorsList } = getValidators({ chainID });

  // Local state to manage the amount and the open status of the dialog
  const [amount, setAmount] = useState<number>(0);

  // Custom hook to get single staking information based on chainID
  const singleStake = useSingleStaking(chainID);

  // Get the available staking assets and denomination
  // const { availableAmount } = singleStake.getStakingAssets();
  const denom = singleStake.getDenomWithChainID(chainID);

  // Custom hook to get staking information
  const staking = useStaking({ isSingleChain: true });

  const availableAmount = singleStake.getAvaiailableAmount(chainID);

  // Handler for input change to set the amount
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(Number(event.target.value));

  // Handler for quick select amount
  const onChangeAmount = (value: number) => {
    setAmount(Number((value * availableAmount).toFixed(6)));
  };

  // Function to perform the delegation transaction
  const doTxDelegate = () => {
    if (selectedValidator) {
      if (!amount || amount <= 0) {
        dispatch(setError({ type: 'error', message: 'Invalid amount' }));
        return;
      }
      staking.txDelegateTx(selectedValidator?.address, amount, chainID);
    } else {
      dispatch(
        setError({ type: 'error', message: 'Please select the validator' })
      );
    }
  };

  // Status of the delegation transaction
  const delegteStatus = staking.txAllChainStakeTxStatus[chainID]?.tx?.status;

  const validatorsLoading = useAppSelector(
    (state) => state.staking.chains?.[chainID]?.validators.status
  );

  const handleDialogClose = () => {
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={handleDialogClose} title="Delegate">
      <div className="flex flex-col w-[800px] items-center gap-6">
        {/* Validator details */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center">
            <ValidatorsAutoComplete
              dataLoading={validatorsLoading === TxStatus.PENDING}
              handleChange={handleValidatorChange}
              options={validatorsList}
              selectedValidator={selectedValidator}
              name="Select Validator"
            />
          </div>
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
          <div className="text-b1 pl-6">
            To make your staked assets liquid, undelegation will take 21 days.
          </div>
        </div>

        {/* Delegate button */}
        <button
          onClick={doTxDelegate}
          className="primary-btn cursor-pointer w-full"
        >
          {delegteStatus === 'pending' ? 'Loading....' : 'Delegate'}
        </button>
      </div>
    </CustomDialog>
  );
};

export default NewDelegationDialog;
