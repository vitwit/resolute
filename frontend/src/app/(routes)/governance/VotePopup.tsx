'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import './style.css';

const VotePopup = () => {
  const [voteOption, setVoteOption] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  const handleVoteChange = (option: string) => {
    setVoteOption(option);
  };
  const handleClose = () => {
    console.log('closing votePopup');
    setIsOpen(false);
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div className="popup-grid">
      <div className="cross" onClick={handleClose}>
        <Image
          src="./plainclose-icon.svg"
          width={24}
          height={24}
          className="cursor-pointer"
          alt="Plainclose-Icon"
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
                <div className="proposal-text-small">Voting ends in 2 days</div>
              </div>
            </div>
            <div className="flex w-full justify-between">
              <div className="radio-buttons">
                <label className="radio-container">
                  <div className="flex space-x-2">
                    <input
                      type="radio"
                      name="voteOption"
                      value="yes"
                      checked={voteOption === 'yes'}
                      onChange={() => handleVoteChange('yes')}
                    />
                    <span className="radio-checkmark">
                      <span className="radio-check"></span>
                    </span>
                    Yes
                  </div>
                </label>

                <label className="radio-container">
                  <div className="flex space-x-2">
                    <input
                      type="radio"
                      name="voteOption"
                      value="no"
                      checked={voteOption === 'no'}
                      onChange={() => handleVoteChange('no')}
                    />
                    <span className="radio-checkmark">
                      <span className="radio-check"></span>
                    </span>
                    No
                  </div>
                </label>

                <label className="radio-container">
                  <div className="flex space-x-2">
                    <input
                      type="radio"
                      name="voteOption"
                      value="abstain"
                      checked={voteOption === 'abstain'}
                      onChange={() => handleVoteChange('abstain')}
                    />
                    <span className="radio-checkmark">
                      <span className="radio-check"></span>
                    </span>
                    Abstain
                  </div>
                </label>

                <label className="radio-container">
                  <div className="flex space-x-2 items-center">
                    <input
                      type="radio"
                      name="voteOption"
                      value="no with veto"
                      checked={voteOption === 'no with veto'}
                      onChange={() => handleVoteChange('no with veto')}
                    />
                    <span className="radio-checkmark">
                      <span className="radio-check"></span>
                    </span>
                    No with Veto
                  </div>
                </label>
              </div>
            </div>
            <div className="placeholder-text">
              <input type="text" placeholder="Enter Justification here"></input>
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
  );
};

export default VotePopup;
