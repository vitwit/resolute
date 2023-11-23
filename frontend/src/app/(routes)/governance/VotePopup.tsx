'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import './style.css';
import RadioButtons from './CustomRadioButton';
import { Dialog, DialogContent } from '@mui/material';

const VotePopup = ({ votingEndsInDays }: { votingEndsInDays: number }) => {
  const [voteOption, setVoteOption] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  const handleVoteChange = (option: string) => {
    setVoteOption(option);
  };
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
            <Image
              src="./plainclose-icon.svg"
              width={24}
              height={24}
              className="cursor-pointer"
              alt="Close"
            />
          </div>
          <div className="image-grid">
            <div className="flex">
              <Image
                src="/vote-image.png"
                width={335}
                height={298}
                alt="Vote-Image"
              />
            </div>
            <div className="text-grid">
              <div className="space-y-6">
                <div className="proposal-text-big">vote</div>
                <div className="text-form">
                  <div className="space-y-1">
                    <div className="space-x-2 flex">
                      <Image
                        src="./cosmos-logo.svg"
                        width={40}
                        height={40}
                        alt="Cosmos-Logo"
                      />
                      <p className="proposal-text-small">#123 | Proposal</p>
                    </div>
                    <div className="proposal-text-normal">
                      Adjust Trade and Earn Rewards Margined Protocol
                    </div>
                    <div className="proposal-text-small">
                      Voting ends in 2 days
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between">
                  <div className="radio-buttons items-center">
                    <RadioButtons
                      name="voteOption"
                      value={'yes'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                    <RadioButtons
                      name="votOption"
                      value={'no'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                    <RadioButtons
                      name="voteOption"
                      value={'abstain'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                    <RadioButtons
                      name="votOption"
                      value={'no with veto'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                  </div>
                </div>
                <div className="placeholder-text">
                  <input
                    type="text"
                    placeholder="Enter Justification here"
                  ></input>
                </div>
                <div>
                  <button className="button w-36">
                    <p className="proposal-text-medium">Vote</p>
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

export default VotePopup;
