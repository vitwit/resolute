'use client';
import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import ValidatorName from '../component/ValidatorName';
import ValidatorLogo from './ValidatorLogo';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';
import { Validator } from '@/types/staking';

interface PopupProps {
  validator: string;
  chainID: string;
  openPopup: boolean;
}

const ReDelegatePopup: React.FC<PopupProps> = ({ openPopup,

  validator,
  chainID,
   }) => {
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(openPopup);
  const [destValidator, setDestValidator] = useState<Validator>()
    console.log(open)
  const singleStake = useSingleStaking(chainID)

  const { totalStakedAmount } = singleStake.getStakingAssets()
  const denom = singleStake.getDenomWithChainID(chainID);

  const staking = useStaking();

  const allVals = singleStake.getValidators()?.active

  const stakeModule = staking.getAllDelegations()

  const val = stakeModule[chainID]?.validators?.active?.[validator]

  const getCommisionRate = () => {
    return Number(get(val, 'commission.commission_rates.rate', 0)) * 100;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(event.target.value))

  const onChangeAmount = (value: number) => {
    setAmount(Number((value * totalStakedAmount).toFixed(6)))
  }

  const doTxDelegate = () => {
    staking.txReDelegateTx(validator, destValidator?.operator_address || '', amount, chainID)
  }

  const delegteStatus = staking.txAllChainStakeTxStatus[chainID]?.tx?.status

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <CustomDialog
        open={true}
        onClose={() => {
          setOpen(false);
        }}
        title={'Re-Delegate'}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <ValidatorName
                valoperAddress={validator}
                chainID={chainID}
              />
            </div>
            <div className="flex justify-between w-full">
              <p className="">
                {get(val, 'description.details', '-')}
              </p>
              <p className="">{getCommisionRate()}% Comission</p>
            </div>
            <div className="divider-line"></div>
          </div>

          <AddressField
            balanceTypeText='Staked'
            denom={denom}
            onChange={onChange}
            value={amount || 0}
            availableAmount={totalStakedAmount}
            quickSelectAmount={onChangeAmount}
          />
          <div className="flex flex-col w-full">
            <p className="">Destination Validator</p>
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="flex items-center gap-2  px-4 py-[10.5px] w-full rounded-[100px] border-[0.25px] border-solid border-[rgba(255,255,255,0.50)]"
                // className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={toggleDropdown}
              >
                {destValidator ? <>
                  <ValidatorLogo
                    width={24}
                    height={24}
                    identity={get(destValidator, 'description.identity', '')}

                  />{' '}
                  &nbsp;
                  {/* Validator name  */}
                  <p className="text-b1 flex items-center">
                    {get(destValidator, 'description.moniker')}
                  </p>{' '}
                  &nbsp;
                  {/* Copy address icon */}
                  <WalletAddress address={destValidator?.operator_address} displayAddress={false} />
                </> : ' Choose Destination Validator'}

              </button>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-[25px] shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {
                      Object.entries(allVals || {}).map(([key, value], index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-600 hover:text-white flex items-center rounded-[25px]"
                          role="menuitem"
                          onClick={() => {
                            console.log(key)
                            toggleDropdown()
                            setDestValidator(value)
                          }}
                        >

                          <ValidatorLogo
                            width={24}
                            height={24}
                            identity={get(value, 'description.identity', '')}

                          />{' '}
                          &nbsp;
                          {/* Validator name  */}
                          <p className="text-b1 flex items-center">
                            {get(value, 'description.moniker')}
                          </p>{' '}
                          &nbsp;
                          {/* Copy address icon */}
                          <WalletAddress address={value?.operator_address} displayAddress={false} />
                          {/* <img src={item.logo} alt={item.name} className="w-6 h-6 mr-3 rounded-full" />
                        {item.name} */}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="staking-alert w-full">
            <div className="flex space-x-2">
              <Image src="/info.svg" width={24} height={24} alt="info-icon" />
              <p className="text-[#FFC13C] text-b1">Important</p>
              <p className="text-b1-light">
                Staking will lock your funds for 21 days
              </p>
            </div>
            <div className="text-b1">
              No staking rewards, cancellation of unbonding, or fund withdrawals
              until 21+ days post-undelegation.
            </div>
          </div>

          <button disabled={!amount}

            onClick={doTxDelegate} className="primary-btn cursor-pointer w-full">
            {
              delegteStatus === 'pending' ? 'Loading....' : 'Re Delegate'
            }
          </button>
        </div>
      </CustomDialog>
    </>
  );
};
export default ReDelegatePopup;
