import CustomDialog from '@/components/common/CustomDialog';
import React from 'react';
import Image from 'next/image';

const DialogViewDetails = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <CustomDialog
      open={open}
      title="cosmori8jk80....ivfjvu848jf"
      onClose={onClose}
      styles="w-[800px]"
    >
      <div className="flex flex-col w-full items-center gap-6">
        <div className="flex justify-between gap-10 w-full">
          <div className="dialog-permission">
            <div className="dialog-permission-header items-start">
              <Image
                src="/akash.png"
                width={24}
                height={24}
                alt="network-logo"
              />
              <p className="text-b1">Send</p>
            </div>
            <div className="flex gap-2 px-6">
              <p className="w-[100px] text-small-light">Spend Limit</p>
              <p className="text-b1">120 AKT</p>
            </div>
            <div className="flex gap-2 px-6">
              <p className="w-[100px] text-small-light">Expiry</p>
              <p className="text-b1">23rd March 2024, 11:23 pm</p>
            </div>
          </div>
          <div className="dialog-permission">
            <div className="dialog-permission-header items-start">
              <Image
                src="/akash.png"
                width={24}
                height={24}
                alt="network-logo"
              />
              <p className="text-b1">Grant Authz</p>
            </div>
            <div className="flex gap-2 px-6">
              <p className="w-[100px] text-small-light">Expiry</p>
              <p className="text-b1">23rd March 2024, 11:23 pm</p>
            </div>
          </div>
        </div>
        <div className="dialog-permission w-full">
          <div className="dialog-permission-header items-start">
            <Image src="/akash.png" width={24} height={24} alt="network-logo" />
            <p className="text-b1">Send</p>
          </div>
          <div className="flex justify-between gap-20 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 px-6">
                <p className="w-[100px] text-small-light">Spend Limit</p>
                <p className="text-b1">120 AKT</p>
              </div>
              <div className="flex gap-2 px-6">
                <p className="w-[100px] text-small-light">Expiry</p>
                <p className="text-b1">23rd March 2024, 11:23 pm</p>
              </div>
            </div>
            <div className="flex gap-4 px-6">
              <p className="text-small-light">Validator List (Deny)</p>
              <div className="flex flex-col gap-2">
                {['Vitwit', 'Stakefish', 'Polkachu'].map((validator, index) => (
                  <div className="flex gap-2" key={index}>
                    <Image
                      src="/akash.png"
                      width={16}
                      height={16}
                      alt="validator-logo"
                    />
                    <p className='text-b1'>{validator}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogViewDetails;
