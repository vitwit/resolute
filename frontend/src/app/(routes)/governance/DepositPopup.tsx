"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import './style.css';

const DepositPopup = ({ votingEndsInDays, denom }: { votingEndsInDays: number; denom: string }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{ sx: { borderRadius: '16px', backgroundColor: '#20172F' } }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="popup-grid">
          <div className="cross" onClick={handleClose}>
            <Image src="./plainclose-icon.svg" width={24} height={24} className="cursor-pointer" alt="Close" />
          </div>
          <div className="image-grid">
            <div className="flex">
              <Image src="/deposit.png" width={335} height={298} alt="Deposit-Image" />
            </div>
            <div className="text-grid">
              <div className="space-y-6">
                <div className="proposal-text-big">Deposit</div>
                <div className="text-form">
                  <div className="space-y-2">
                    <div className="space-x-2 flex">
                      <Image src="./cosmos-logo.svg" width={40} height={40} alt="Cosmos-Logo" />
                      <p className="proposal-text-small">#123 | Proposal</p>
                    </div>
                    <div className="proposal-text-normal">Adjust Trade and Earn Rewards Margined Protocol</div>
                    <div className="proposal-text-small">{`Voting ends in ${votingEndsInDays} days`}</div>
                  </div>
                </div>

                <div className="placeholder-text ">
                  <div className="flex w-full justify-between">
                    <input type="text" placeholder="Enter Amount Here" />
                    <div className="proposal-text-extralight flex items-center">{denom}</div>
                  </div>
                </div>
                <div>
                  <button className="button w-36">
                    <p className="proposal-text-medium">Deposit</p>
                  </button>
                </div>
              </div>
              <div className="cross"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositPopup;
