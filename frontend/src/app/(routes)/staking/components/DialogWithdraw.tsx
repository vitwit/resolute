import {
  customMUITextFieldStyles,
  dialogBoxPaperPropStyles,
} from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent, TextField } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogWithdraw = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleDialogClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={onClose}>
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
              <h2 className="text-[20px] font-bold leading-normal">
                Withdraw Rewards
              </h2>
              <div className="bg-[#ffffff1a] rounded-3xl p-6 flex gap-6 my-6">
                <div className="flex-1 relative">
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-2xl w-full"
                    name="granteeAddress"
                    value={''}
                    onChange={() => {}}
                    required
                    autoFocus={true}
                    placeholder="Enter withdraw address"
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                          padding: 2,
                        },
                      },
                    }}
                    sx={customMUITextFieldStyles}
                  />
                  <div className="absolute right-0">
                    <div className="flex space-x-2 justify-end">
                      <Image
                        src="/info.svg"
                        width={16}
                        height={16}
                        alt="Info-Icon"
                        draggable={false}
                      />
                      <p className="txt-xs">
                        Your claim rewards will be updated to this address
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="primary-gradient rounded-2xl flex justify-center items-center w-[212px]"
                >
                  Update Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogWithdraw;
