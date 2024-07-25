'use client';

import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import ValidatorLogo from './ValidatorLogo';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';
import { Validator } from '@/types/staking';
import ValidatorName from './ValidatorName';

interface PopupProps {
  validator: string;
  chainID: string;
  openPopup: boolean;
  openReDelegatePopup: () => void;
}

const ReDelegatePopup: React.FC<PopupProps> = ({
  validator,
  chainID,
  openPopup,
  openReDelegatePopup,
}) => {
  // Local state to manage the amount, open status, and destination validator
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(openPopup);
  const [destValidator, setDestValidator] = useState<Validator | undefined>();

  // Custom hooks to fetch staking details
  const singleStake = useSingleStaking(chainID);
  const totalStakedAmount = singleStake.totalValStakedAssets(
    chainID,
    validator
  );
  const denom = singleStake.getDenomWithChainID(chainID);
  const staking = useStaking({ isSingleChain: true });
  const allVals = singleStake.getValidators()?.active;
  const stakeModule = staking.getAllDelegations();
  const val = stakeModule[chainID]?.validators?.active?.[validator];

  // Function to get the commission rate of the validator
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

  // Function to perform the re-delegation transaction
  const doTxDelegate = () => {
    staking.txReDelegateTx(
      validator,
      destValidator?.operator_address || '',
      amount,
      chainID
    );
  };

  // Status of the delegation transaction
  const delegteStatus = staking.txAllChainStakeTxStatus[chainID]?.tx?.status;

  // State to manage the dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <CustomDialog
        open={open}
        onClose={() => {
          setOpen(false);
          openReDelegatePopup();
        }}
        title="Re-Delegate"
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
            balanceTypeText="Staked"
            denom={denom}
            onChange={onChange}
            value={amount || 0}
            availableAmount={totalStakedAmount}
            quickSelectAmount={onChangeAmount}
          />

          {/* Destination validator selection */}
          <div className="flex flex-col w-full">
            <p className="secondary-text pb-1">Destination Validator</p>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="flex items-center gap-1 w-full px-4 py-[10.5px] rounded-[100px] border-[0.25px] border-[#ffffff30]
}"
                onClick={toggleDropdown}
              >
                {destValidator ? (
                  <>
                    <ValidatorLogo
                      width={24}
                      height={24}
                      identity={get(destValidator, 'description.identity', '')}
                    />
                    &nbsp;
                    <p className="text-b1 flex items-center">
                      {get(destValidator, 'description.moniker')}
                    </p>
                    &nbsp;
                    <WalletAddress
                      address={destValidator?.operator_address}
                      displayAddress={false}
                    />
                  </>
                ) : (
                  <p className="secondary-text">Choose Destination Validator</p>
                )}
              </button>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-full reDelegate-dropdown">
                  <div
                    className="max-h-[20vh] overflow-y-scroll w-full rounded-2xl"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {Object.entries(allVals || {}).map(([key, value]) => (
                      <button
                        key={key}
                        className="w-full px-4 py-2 flex items-center hover:bg-[#FFFFFF10] gap-1"
                        role="menuitem"
                        onClick={() => {
                          toggleDropdown();
                          setDestValidator(value);
                        }}
                      >
                        <ValidatorLogo
                          width={24}
                          height={24}
                          identity={get(value, 'description.identity', '')}
                        />
                        &nbsp;
                        <p className="text-b1 flex items-center">
                          {get(value, 'description.moniker')}
                        </p>
                        &nbsp;
                        <WalletAddress
                          address={value?.operator_address}
                          displayAddress={false}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

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
                Staking will lock your funds for 21 days
              </p>
            </div>
            <div className="text-b1 pl-7">
              No staking rewards, cancellation of unbonding, or fund withdrawals
              until 21+ days post-undelegation.
            </div>
          </div>

          {/* Re-Delegate button */}
          <button
            disabled={!amount}
            onClick={doTxDelegate}
            className="primary-btn cursor-pointer w-full"
          >
            {delegteStatus === 'pending' ? 'Loading....' : 'Re Delegate'}
          </button>
        </div>
      </CustomDialog>
    </>
  );
};

export default ReDelegatePopup;
