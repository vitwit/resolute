'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import './style.css';
import RadioButton from './CustomRadioButton';
import { Dialog, DialogContent } from '@mui/material';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { txVote } from '@/store/features/gov/govSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

interface VoteOptionNumber {
  [key: string]: number;
}

const voteOptionNumber: VoteOptionNumber = {
  yes: 1,
  no: 2,
  abstain: 3,
  veto: 4,
};

const VotePopup = ({
  votingEndsInDays,
  proposalId,
  proposalname,
  chainID,
}: {
  votingEndsInDays: string;
  proposalId: number;
  proposalname: string;
  chainID: string;
}) => {
  const [voteOption, setVoteOption] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  const handleVoteChange = (option: string) => {
    setVoteOption(option);
  };

  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const handleClose = () => {
    setIsOpen(false);
  };

  const dispatch = useAppDispatch();

  const handleVote = () => {
    const { address, aminoConfig, feeAmount, prefix, rest, rpc } =
      getChainInfo(chainID);
    const { minimalDenom } = getDenomInfo(chainID);

    dispatch(
      txVote({
        voter: address,
        proposalId: proposalId,
        option: voteOptionNumber[voteOption],
        denom: minimalDenom,
        chainID: chainID,
        rpc: rpc,
        rest: rest,
        aminoConfig: aminoConfig,
        prefix: prefix,
        feeAmount: feeAmount,
        feegranter: '',
        justification: '',
      })
    );
  };

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
              src="/plainclose-icon.svg"
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
                <div className="proposal-text-big">Vote</div>
                <div className="text-form">
                  <div className="space-y-1">
                    <div className="space-x-2 flex">
                      <Image
                        src="/cosmos-logo.svg"
                        width={40}
                        height={40}
                        alt="Cosmos-Logo"
                      />
                      <p className="proposal-text-small">
                        #{proposalId} | Proposal
                      </p>
                    </div>
                    <div className="proposal-text-normal">{proposalname}</div>
                    <div className="proposal-text-small">
                      {`Voting ends in ${votingEndsInDays}`}
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between relative top-1">
                  <div className="radio-buttons">
                    <RadioButton
                      name="voteOption"
                      value={'yes'}
                      displayOption={'Yes'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                    <RadioButton
                      name="voteOption"
                      value={'no'}
                      displayOption={'No'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                    <RadioButton
                      name="voteOption"
                      value={'abstain'}
                      displayOption={'Abstain'}
                      voteOption={voteOption}
                      handleVoteChange={handleVoteChange}
                    />
                    <RadioButton
                      name="voteOption"
                      value={'veto'}
                      displayOption={'No With Veto'}
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
                  <button onClick={handleVote} className="button w-36">
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
