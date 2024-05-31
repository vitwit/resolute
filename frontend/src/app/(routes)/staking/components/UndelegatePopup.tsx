'use client';
import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';

const UndelegatePopup = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CustomDialog
        open={true}
        onClose={() => {
          setOpen(false);
        }}
        title={'Un-Delegate'}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <Image src="" width={24} height={24} alt="Validator-Logo" />
              <p className="">Vitwit</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="">
                Connect your wallet now to access all the modules on resolute{' '}
              </p>
              <p className="">05% Comission</p>
            </div>
            <div className="divider-line"></div>
          </div>
          {/* <InputField /> */}

          <AddressField
            quickSelectAmount={function (value: string): void {
              console.log('');
            }}
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
              No staking rewards, cancellation of unbonding, or fund withdrawals
              until 21+ days post-undelegation.
            </div>
          </div>

          <button className="primary-btn cursor-pointer w-full">
            Un-Delegate
          </button>
        </div>
      </CustomDialog>
    </>
  );
};
export default UndelegatePopup;
