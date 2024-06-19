import { REDIRECT_ICON, TIMER_ICON } from '@/constants/image-names';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { HandleSelectProposalEvent, SelectedProposal } from '@/types/gov';
import Image from 'next/image';
import React, { useState } from 'react';
import DialogDeposit from '../popups/DialogDeposit';
import DialogVote from '../popups/DialogVote';

const ProposalItem = ({
  chainLogo,
  chainName,
  endTime,
  handleViewProposal,
  isActive,
  proposalId,
  proposalTitle,
  selectedProposal,
  chainID,
}: {
  selectedProposal: SelectedProposal | null;
  proposalId: string;
  chainLogo: string;
  handleViewProposal: HandleSelectProposalEvent;
  proposalTitle: string;
  isActive: boolean;
  chainName: string;
  endTime: string;
  chainID: string;
}) => {
  const dispatch = useAppDispatch();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className={`flex justify-between w-full px-6 py-2 ${selectedProposal && selectedProposal.proposalId === proposalId && selectedProposal.chainID === chainID ? 'bg-[#ffffff14] rounded-2xl' : ''} `}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <div className="proposal-id">
              <span>{proposalId}</span>
              <div className="bottom-network-logo">
                <Image
                  src={chainLogo}
                  width={20}
                  height={20}
                  alt="Network-Logo"
                  className="rounded-full"
                />
              </div>
            </div>
            <div
              className="flex space-x-1 items-center cursor-pointer"
              onClick={() => {
                handleViewProposal({
                  proposalId,
                  chainID,
                  isActive,
                });
              }}
            >
              <p
                className={`text-h2 truncate ${selectedProposal ? 'max-w-[254px]' : 'max-w-[500px]'}`}
              >
                {proposalTitle}
              </p>
              <button type="button" className="flex justify-center">
                <Image
                  src={REDIRECT_ICON}
                  width={24}
                  height={24}
                  alt="View-full-icon"
                />
              </button>
            </div>
            <>
              {isActive ? (
                <div className="active-badge">Active</div>
              ) : (
                <div className="deposit-badge">Deposit</div>
              )}
            </>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex space-x-1 min-w-[180px]">
              <Image
                src={TIMER_ICON}
                width={16}
                height={16}
                alt="Address-icon"
              />
              <p className="secondary-text">
                {isActive ? 'Voting ends in' : 'Deposit ends in'} {endTime}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                className="w-4 h-4 rounded-full"
                src={chainLogo}
                width={16}
                height={16}
                alt=""
              />
              <p className="secondary-text capitalize">{chainName} Network</p>
            </div>
          </div>
        </div>
        {selectedProposal ? null : (
          <div className="flex items-end justify-end">
            <button
              onClick={() => {
                if (!isWalletConnected) {
                  dispatch(
                    setError({
                      type: 'error',
                      message: 'Connect Wallet to proceed with transaction',
                    })
                  );
                  return;
                }
                if (isActive) {
                  setVoteDialogOpen(true);
                } else {
                  setDepositDialogOpen(true);
                }
              }}
              className="primary-btn w-20"
            >
              {isActive ? 'Vote' : 'Deposit'}
            </button>
          </div>
        )}
      </div>
      <div className="divider-line"></div>
      {depositDialogOpen ? (
        <DialogDeposit
          chainID={chainID}
          onClose={() => setDepositDialogOpen(false)}
          open={depositDialogOpen}
          proposalTitle={proposalTitle}
          endTime={endTime}
          proposalId={proposalId}
        />
      ) : null}
      {voteDialogOpen ? (
        <DialogVote
          chainID={chainID}
          onClose={() => setVoteDialogOpen(false)}
          open={voteDialogOpen}
          proposalTitle={proposalTitle}
          endTime={endTime}
          proposalId={proposalId}
        />
      ) : null}
    </div>
  );
};

export default ProposalItem;
