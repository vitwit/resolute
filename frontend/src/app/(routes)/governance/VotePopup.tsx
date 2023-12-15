'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './style.css';
import RadioButton from './CustomRadioButton';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txVote } from '@/store/features/gov/govSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { get } from 'lodash';

interface VoteOptionNumber {
  [key: string]: number;
}

const voteOptionNumber: VoteOptionNumber = {
  yes: 1,
  no: 3,
  abstain: 2,
  veto: 4,
};

interface VotePopupProps {
  votingEndsInDays: string;
  proposalId: number;
  proposalname: string;
  chainID: string;
  open: boolean;
  onClose: () => void;
  networkLogo: string;
}

const VotePopup: React.FC<VotePopupProps> = ({
  votingEndsInDays,
  proposalId,
  proposalname,
  chainID,
  open,
  onClose,
  networkLogo,
}) => {
  const [voteOption, setVoteOption] = useState<string>('');
  const [voteMemo, setVoteMemo] = useState<string>('');

  const handleVoteChange = (option: string) => {
    setVoteOption(option);
  };

  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const handleClose = () => {
    onClose();
  };

  const txVoteStatus = useAppSelector(state => state.gov.chains[chainID])

  useEffect(()=>{
    if (get(txVoteStatus, 'tx.status') === 'idle') {
      onClose()
    }
  }, [txVoteStatus])

  const dispatch = useAppDispatch();

  const handleVote = async () => {
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
        justification: voteMemo,
      })
    );
  };

  return (
    <Dialog
      open={open}
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
                <div className="proposal-text-big font-bold">Vote</div>
                <div className="text-form">
                  <div className="space-y-1">
                    <div className='space-y-4'>
                      <div className='flex justify-between'>
                        <div className="space-x-2 flex">
                          <Image
                            src={networkLogo}
                            width={32}
                            height={32}
                            alt="logo"
                          />
                          <p className="proposal-text-small">
                            #{proposalId} | Proposal
                          </p>

                        </div>
                        <div className="proposal-text-small">
                          {`Voting ends in ${votingEndsInDays}`}
                        </div>
                      </div>
                      <div className="proposal-text-normal-base">{proposalname}</div>
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
                <div className="placeholder-text w-full">
                  <input
                    className="search-validator-input"
                    type="text"
                    value={voteMemo}
                    onChange={e => setVoteMemo(e.target.value)}
                    placeholder="Enter Justification here"
                  ></input>
                </div>
                <div>
                  {
                    get(txVoteStatus, 'tx.status') === 'pending' ?
                      <button disabled={true} className="button w-36">
                       <CircularProgress size={20} />
                      </button> : <button disabled={!voteOption} onClick={handleVote} className="button w-36">
                        <p className="proposal-text-medium">Vote</p>
                      </button>
                  }

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
