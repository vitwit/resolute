'use client';
import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';
import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import ValidatorName from '../component/ValidatorName';

interface PopupProps {
  validator: string;
  chainID: string;
  openPopup: boolean;
  openDelegatePopup: () => void
}

const DelegatePopup: React.FC<PopupProps> = ({ openPopup,
  validator,
  chainID,
  openDelegatePopup }) => {
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(openPopup);
  console.log(open)

  const singleStake = useSingleStaking(chainID)

  const { availableAmount } = singleStake.getStakingAssets()
  const denom = singleStake.getDenomWithChainID(chainID);

  const staking = useStaking();

  const stakeModule = staking.getAllDelegations()

  const val = stakeModule[chainID]?.validators?.active?.[validator]

  const getCommisionRate = () => {
    return Number(get(val, 'commission.commission_rates.rate', 0)) * 100;
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(event.target.value))

  const onChangeAmount = (value: number) => {
    setAmount(Number((value * availableAmount).toFixed(6)))
  }

  const doTxDelegate = () => {
    staking.txDelegateTx(validator, amount, chainID)
  }

  const delegteStatus = staking.txAllChainStakeTxStatus[chainID]?.tx?.status

  return (
    <>
      <CustomDialog
        open={true}
        onClose={() => {
          openDelegatePopup();
          setOpen(false);
        }}
        title={'Delegate'}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <ValidatorName
                valoperAddress={validator}
                chainID={chainID}
              />
              {/* <p className="">{get(val, 'description.moniker', validator)}</p> */}
            </div>
            <div className="flex justify-between w-full">
              <p className="">
                {get(val, 'description.details', '-')}
                {/* Connect your wallet now to access all the modules on resolute{' '} */}
              </p>
              <p className="">{getCommisionRate()}% Comission</p>
            </div>
            <div className="divider-line"></div>
          </div>
          {/* <InputField /> */}

          <AddressField
            balanceTypeText='Available'
            denom={denom}
            onChange={onChange}
            value={amount || 0}
            availableAmount={availableAmount}
            quickSelectAmount={onChangeAmount}
          />
          <div className="staking-alert w-full">
            <div className="flex space-x-2">
              <Image src="/info.svg" width={24} height={24} alt="info-icon" />
              <p className="text-[#FFC13C] text-b1">Important</p>
              <p className="text-b1-light">
                Staking will lock your funds for 21 days
              </p>
            </div>
            <div className="text-b1">
              To make your staked assets liquid, undelegation will take 21 days.
            </div>
          </div>

          <button disabled={!amount}

            onClick={doTxDelegate} className="primary-btn cursor-pointer w-full">
            {
              delegteStatus === 'pending' ? 'Loading....' : 'Delegate'
            }
          </button>
        </div>
      </CustomDialog>
    </>
  );
};
export default DelegatePopup;
