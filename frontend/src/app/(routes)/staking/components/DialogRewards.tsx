import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent, TextField } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { customMUITextFieldStyles } from '@/utils/commonStyles';

const DialogRewards = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleDialogClose = () => {
    onClose();
  };
  const [addressUpdated, setAddressUpdated] = useState(false);
  const [address, setAddress] = useState('');
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value.trim());
    setAddressUpdated(false);
  };

  const handleUpdateAddress = () => {
    setAddress('agoric1sqq0e86e8tugvcwksqn04z9pcl8ludzrdxx2cx');
  };

  const handleConfirmButtonClick = () => {
    console.log('Address Confirmed:', address);
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
            <div onClick={handleDialogClose}>
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
          <div className="gap-16 px-10 space-y-10">
            <div className="text-white text-xl not-italic font-bold leading-[normal]">
              Withdraw Rewards
            </div>
            <div className="divider-line"></div>
            <div className="staking-rewards-background">
              <div className="flex justify-between w-full">
                <div className="w-[70%]">
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-2xl w-full"
                    name="Address"
                    value={address}
                    onChange={handleAddressChange}
                    required
                    autoFocus={true}
                    placeholder="agoric1sqq0e86e8tugvcwksqn04z9pcl8ludzrdxx2cx"
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
                  <div className="flex space-x-2">
                    <Image
                      src="/info.svg"
                      width={24}
                      height={24}
                      alt="Info-Icon"
                      draggable={false}
                    />
                    <p>Your claim rewards will be updated to this address</p>
                  </div>
                </div>

                <button
                  className="update-staking-btn primary-gradient"
                  onClick={handleUpdateAddress}
                  style={{ display: addressUpdated ? 'none' : 'block' }}
                >
                  Update Address
                </button>
                {addressUpdated && (
                  <button
                    className="confirm-button primary-gradient"
                    onClick={handleConfirmButtonClick}
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-6">
              <div className="staking-sidebar-actions-btn text-center cursor-pointer">
                Claim Rewards
              </div>
              <div className="staking-sidebar-actions-btn text-center cursor-pointer">
                Claim Rewards & Commission
              </div>
            </div>
          </div>

          <div className="justify-end items-center gap-2.5 pt-10 pb-0 px-6"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogRewards;
