'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import './style.css';
import RadioButton from './CustomRadioButton';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txVote } from '@/store/features/gov/govSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { RootState } from '@/store/store';
import { TxStatus } from '@/types/enums';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';

interface VoteOptionNumber {
  [key: string]: number;
}

const voteOptionNumber: VoteOptionNumber = {
  yes: 1,
  no: 3,
  abstain: 2,
  veto: 4,
};

const VotePopup = ({
  votingEndsInDays,
  proposalId,
  proposalname,
  chainID,
  open,
  onClose,
  networkLogo,
}: {
  votingEndsInDays: string;
  proposalId: number;
  proposalname: string;
  chainID: string;
  open: boolean;
  onClose: () => void;
  networkLogo: string;
}) => {
  const [voteOption, setVoteOption] = useState<string>('');
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzGranter = useAppSelector((state) => state.authz.authzAddress);
  const { txAuthzVote } = useAuthzExecHelper();

  const handleVoteChange = (option: string) => {
    setVoteOption(option);
  };

  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const handleClose = () => {
    onClose();
  };

  const loading = useAppSelector(
    (state: RootState) => state.gov.chains?.[chainID]?.tx?.status
  );

  const authzLoading = useAppSelector(
    (state) => state.authz.chains?.[chainID]?.tx?.status || TxStatus.INIT
  );

  const dispatch = useAppDispatch();

  const handleVote = () => {
    const basicChainInfo = getChainInfo(chainID);
    const { address, aminoConfig, feeAmount, prefix, rest, rpc } =
      basicChainInfo;
    const { minimalDenom } = getDenomInfo(chainID);

    if (isAuthzMode) {
      txAuthzVote({
        grantee: address,
        proposalId,
        option: voteOptionNumber[voteOption],
        granter: authzGranter,
        chainID,
        memo: '',
      });
      return;
    }

    dispatch(
      txVote({
        basicChainInfo,
        isAuthzMode: false,
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
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{ sx: dialogBoxPaperPropStyles }}
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
                className="disable-draggable"
              />
            </div>
            <div className="text-grid">
              <div className="space-y-6">
                <div className="proposal-text-big font-bold">Vote</div>
                <div className="text-form">
                  <div className="space-y-1">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="space-x-2 flex">
                          <Image
                            className="rounded-full"
                            src={networkLogo}
                            width={32}
                            height={32}
                            alt="logo"
                          />
                          <p className="proposal-text-small">#{proposalId}</p>
                        </div>
                        <div className="proposal-text-small">
                          {`Voting ends in ${votingEndsInDays}`}
                        </div>
                      </div>
                      <div className="proposal-text-normal-base">
                        {proposalname}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between relative top-1">
                  <div className="radio-buttons">
                    <div className="back">
                      <RadioButton
                        name="voteOption"
                        value={'yes'}
                        displayOption={'Yes'}
                        voteOption={voteOption}
                        handleVoteChange={handleVoteChange}
                      />
                    </div>
                    <div className="back">
                      <RadioButton
                        name="voteOption"
                        value={'no'}
                        displayOption={'No'}
                        voteOption={voteOption}
                        handleVoteChange={handleVoteChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between relative top-1">
                  <div className="radio-buttons">
                    <div className="back">
                      <RadioButton
                        name="voteOption"
                        value={'abstain'}
                        displayOption={'Abstain'}
                        voteOption={voteOption}
                        handleVoteChange={handleVoteChange}
                      />
                    </div>
                    <div className="back">
                      <RadioButton
                        name="voteOption"
                        value={'veto'}
                        displayOption={'No With Veto'}
                        voteOption={voteOption}
                        handleVoteChange={handleVoteChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="placeholder-text w-full">
                  <input
                    className="search-validator-input"
                    type="text"
                    placeholder="Enter Justification Here (Optional)"
                  ></input>
                </div>
                <div>
                  <button
                    onClick={handleVote}
                    className="vote-popup-btn proposal-text-medium"
                    disabled={
                      (!isAuthzMode && loading === TxStatus.PENDING) ||
                      (isAuthzMode && authzLoading === TxStatus.PENDING)
                    }
                  >
                    {(!isAuthzMode && loading === TxStatus.PENDING) ||
                    (isAuthzMode && authzLoading === TxStatus.PENDING) ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : (
                      'Vote'
                    )}{' '}
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
