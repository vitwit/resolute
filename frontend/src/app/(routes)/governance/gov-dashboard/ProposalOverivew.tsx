import { REDIRECT_ICON, TIMER_ICON } from '@/constants/image-names';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import Image from 'next/image';
import React, { useState } from 'react';
import Vote from './Vote';
import CustomButton from '@/components/common/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import DialogDeposit from '../popups/DialogDeposit';
import { useRouter } from 'next/navigation';

const PROPOSAL_OVERVIEW_MAX_LENGTH = 900;

const ProposalOverview = ({
  chainID,
  proposalId,
  isActive,
  onClose,
}: {
  proposalId: string;
  chainID: string;
  isActive: boolean;
  onClose: ({
    chainID,
    proposalId,
    isActive,
  }: {
    chainID: string;
    proposalId: string;
    isActive: boolean;
  }) => void;
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
    <div className="pt-6 h-full w-full">
      <div className="proposal-view  h-full !w-full">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex space-x-1 items-center">
                    <p
                      onClick={navigateToProposal}
                      className="text-h2 max-w-[400px] truncate cursor-pointer hover:underline hover:underline-offset-[3px]"
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
                <div className="hover:bg-[#ffffff10] w-10 h-10 rounded-full flex items-center justify-center">
                  <button className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/close.svg"
                      width={24}
                      height={24}
                      alt="close-icon"
                      onClick={() => onClose({ chainID, proposalId, isActive })}
                    />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <Image
                    src={TIMER_ICON}
                    width={16}
                    height={16}
                    alt="timer-icon"
                  />
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

            <div className="flex gap-2 flex-col">
              <div className="text-[#ffffffad] text-base">Summary</div>
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
    </div>
  );
};

export default ProposalOverview;
