import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogSearchContract = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={handleClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-10 flex gap-6 px-10 items-center">
            <div className="flex flex-col gap-10 w-full">
              <div className="flex items-center gap-2">
                \
                <h2 className="text-[20px] font-bold leading-normal">
                  {'validator?.description?.moniker' || '-'}
                </h2>
              </div>
              <div className="space-y-6">
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-2 w-full space-y-4">
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-10">
                      Commission
                    </div>
                    <div className="font-medium leading-10">lklk</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-10">
                      Available for Delegation
                    </div>
                    <div className="font-medium leading-10">,kj kj</div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-4 w-full space-y-4">
                  <div className="flex gap-2 text-[14px]">
                    <div className="w-[200px] font-light leading-[24px]">
                      <p>Staking will lock your</p>
                      <p>ljkjln</p>
                    </div>
                    <div className="font-medium leading-6 flex-1">
                      <p>
                        You will need to undelegate in order for your staked
                        assets to be liquid again.{' '}
                      </p>
                      <p>This process will take </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSearchContract;
