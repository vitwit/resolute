import { REDIRECT_ICON, TIMER_ICON } from '@/constants/image-names';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { HandleSelectProposalEvent, SelectedProposal } from '@/types/gov';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DialogDeposit from '../popups/DialogDeposit';
import DialogVote from '../popups/DialogVote';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getColorForVoteOption } from '@/utils/util';
import { getVotes } from '@/store/features/gov/govSlice';
import useAddressConverter from '@/custom-hooks/useAddressConverter';
import { TxStatus } from '@/types/enums';

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
  const { getChainInfo } = useGetChainInfo();
  const { address, baseURL, restURLs: baseURLs, govV1 } = getChainInfo(chainID);
  const { getVote } = useGetProposals();
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const { convertAddress } = useAddressConverter();
  const authzGranterAddress = convertAddress(chainID, authzAddress);

  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);

  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const alreadyVotedOption = getVote({
    address: isAuthzMode ? authzGranterAddress : address,
    chainID,
    proposalId,
  });
  const txVoteStatus = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tx?.status
  );

  const fetchVotes = () => {
    dispatch(
      getVotes({
        baseURL,
        baseURLs,
        proposalId: Number(proposalId),
        voter: isAuthzMode ? authzGranterAddress : address,
        chainID,
        govV1,
      })
    );
  }

  useEffect(() => {
    if (isWalletConnected) {
      fetchVotes();
    }
  }, [isWalletConnected, isAuthzMode]);

  useEffect(() => {
    if(txVoteStatus === TxStatus.IDLE) {
      fetchVotes();
    }
  }, [txVoteStatus])

  return (
    <div className="flex flex-col w-full justify-between cursor-pointer">
      <div
        className={`flex justify-between w-full px-6 py-6 hover:bg-[#ffffff14] rounded-2xl ${selectedProposal && selectedProposal.proposalId === proposalId && selectedProposal.chainID === chainID ? 'bg-[#ffffff14] rounded-2xl' : ''} `}
        onClick={() => {
          handleViewProposal({
            proposalId,
            chainID,
            isActive,
          });
        }}
      >
        <div className="flex gap-2">
          <div className="proposal-id">
            <span>{proposalId}</span>
            <div className="bottom-network-logo">
              <Image
                src={chainLogo}
                width={16}
                height={16}
                alt="Network-Logo"
                className="rounded-full"
                draggable={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div
              className={`flex items-center gap-6 ${selectedProposal ? 'justify-between w-full' : ''}`}
            >
              <div className="flex space-x-1 items-center cursor-pointer">
                <p
                  className={`text-[14px] truncate ${selectedProposal ? 'max-w-[320px]' : 'max-w-[500px]'}`}
                >
                  {proposalTitle}
                </p>
                <button
                  type="button"
                  className="flex justify-center"
                  // onClick={() => setShowBadges(!showBadges)}
                >
                  <Image
                    src={REDIRECT_ICON}
                    width={24}
                    height={24}
                    alt="View-full-icon"
                    draggable={false}
                  />
                </button>
              </div>

              {!selectedProposal && (
                <div className="text-b1">
                  {isActive ? (
                    <div className="active-badge">Active</div>
                  ) : (
                    <div className="deposit-badge">Deposit</div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex space-x-1 items-center">
                <Image
                  src={TIMER_ICON}
                  width={16}
                  height={16}
                  alt="timer-icon"
                  draggable={false}
                />
                <p className="text-[rgba(255,255,255,0.50)] text-xs leading-[18px]">
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
                  draggable={false}
                />
                <p className="text-[rgba(255,255,255,0.50)] text-xs capitalize leading-[18px]">
                  {chainName} Network
                </p>
              </div>
              {!selectedProposal && (
                <div className="flex items-center gap-1">
                  {alreadyVotedOption?.length ? (
                    <div className="flex justify-end italic">
                      <div className="text-[12px] flex items-end gap-[3px]">
                        <div className="font-light text-[#ffffff80]">
                          You have voted
                        </div>
                        <div
                          style={{
                            color: getColorForVoteOption(alreadyVotedOption),
                          }}
                          className="capitalize font-bold"
                        >
                          {alreadyVotedOption}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedProposal ? null : (
          <div className="flex items-end justify-end">
            <button
              onClick={(e) => {
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
                e.stopPropagation();
              }}
              className="primary-btn w-20"
            >
              {isActive ? 'Vote' : 'Deposit'}
            </button>
          </div>
        )}
      </div>
      {/* <div className="divider-line"></div> */}
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
