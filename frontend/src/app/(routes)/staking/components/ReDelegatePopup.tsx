'use client';
import CustomDialog from '@/components/common/CustomDialog';
import { useState } from 'react';
import Image from 'next/image';
import AddressField from './AddressField';

const ReDelegatePopup = () => {
  const [open, setOpen] = useState(false);
  console.log({open})
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

          <AddressField
            quickSelectAmount={function (value: string): void {
              console.log('',value);
            }}
          />
          <div className="flex flex-col w-full">
            <p className="">Destination Validator</p>
            <div className="flex items-center gap-2  px-4 py-[10.5px] w-full rounded-[100px] border-[0.25px] border-solid border-[rgba(255,255,255,0.50)]">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Image
                    src="/akash-logo.svg"
                    width={20}
                    height={20}
                    alt="Validator-logo"
                  />
                  <p className="">Stakefish</p>
                </div>
              </div>
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

          <button className="primary-btn cursor-pointer w-full">
            Re-Delegate
          </button>
        </div>
      </CustomDialog>
    </>
  );
};
export default ReDelegatePopup;
