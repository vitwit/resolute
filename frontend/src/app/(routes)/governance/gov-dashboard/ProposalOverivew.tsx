import { REDIRECT_ICON } from '@/constants/image-names';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import Image from 'next/image';
import React, { useState } from 'react';
import Vote from './Vote';
import CustomButton from '@/components/common/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import DialogDeposit from '../popups/DialogDeposit';
import { useRouter } from 'next/navigation';

const PROPOSAL_OVERVIEW_MAX_LENGTH = 300;

const ProposalOverview = ({
  chainID,
  proposalId,
  isActive,
  onClose,
}: {
  proposalId: string;
  chainID: string;
  isActive: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { getProposalOverview } = useGetProposals();
  const { chainLogo, chainName, proposalInfo } = getProposalOverview({
    chainID,
    proposalId,
    isActive,
  });
  const { endTime, proposalDescription, proposalTitle } = proposalInfo;
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const truncatedDescription = proposalDescription.slice(
    0,
    PROPOSAL_OVERVIEW_MAX_LENGTH
  );
  const isDescriptionTruncated =
    truncatedDescription.length < proposalDescription.length;

  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  const navigateToProposal = () => {
    router.push(`/governance/${chainName}/${proposalId}`);
  };

  return (
    <div className="proposal-view">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="items-start">
              <button className="secondary-btn" onClick={onClose}>
                Go back
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 justify-between">
                <div className="flex space-x-1 items-center">
                  <p
                    onClick={navigateToProposal}
                    className="text-h2 max-w-[400px] truncate cursor-pointer"
                  >
                    {proposalTitle}
                  </p>
                  <Image
                    src={REDIRECT_ICON}
                    width={24}
                    height={24}
                    alt="View Proposal"
                    onClick={navigateToProposal}
                    className="cursor-pointer"
                    draggable={false}
                  />
                </div>
                {isActive ? (
                  <div className="active-badge text-b1">Active</div>
                ) : (
                  <div className="deposit-badge text-b1">Deposit</div>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex gap-2 items-center">
                  <p className="text-small-light ">
                    {isActive ? 'Voting' : 'Deposit'}
                  </p>
                  <p className="text-b1">ends in {endTime}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-small-light ">on</p>
                  <div className="flex gap-1 items-center">
                    <Image
                      src={chainLogo}
                      width={20}
                      height={20}
                      alt="Network-logo"
                      draggable={false}
                    />
                    <p className="text-b1 capitalize">{chainName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 flex-col">
            <div className="text-white text-base">Proposal Summary</div>
            <div className="divider-line"></div>
            <div className="secondary-text">
              {truncatedDescription || proposalTitle}
              {isDescriptionTruncated && '...'}
            </div>
          </div>
        </div>
        {isActive ? (
          <Vote proposalId={proposalId} chainID={chainID} colCount={4} />
        ) : (
          <CustomButton
            btnText={
              isWalletConnected ? 'Deposit' : 'Connect Wallet to Deposit'
            }
            btnOnClick={() => {
              if (isWalletConnected) {
                setDepositDialogOpen(true);
              } else {
                connectWalletOpen();
              }
            }}
          />
        )}
      </div>
      {isActive ? null : (
        <DialogDeposit
          chainID={chainID}
          endTime={endTime}
          onClose={() => setDepositDialogOpen(false)}
          open={depositDialogOpen}
          proposalId={proposalId}
          proposalTitle={proposalTitle}
        />
      )}
    </div>
  );
};

export default ProposalOverview;
