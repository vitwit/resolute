import { REDIRECT_ICON, TIMER_ICON } from '@/constants/image-names';
import useGetProposals from '@/custom-hooks/governance/useGetProposals';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Vote from './Vote';
import CustomButton from '@/components/common/CustomButton';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import DialogDeposit from '../popups/DialogDeposit';
import { useRouter } from 'next/navigation';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { RootState } from '@/store/store';
import { get } from 'lodash';
import {
  getDepositParams,
  getGovTallyParams,
  getProposal,
  getProposalTally,
} from '@/store/features/gov/govSlice';
import { getPoolInfo } from '@/store/features/staking/stakeSlice';
import { Tooltip } from '@mui/material';
import { useRemark } from 'react-remark';

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
  const { getProposalOverview } = useGetProposals();
  const { chainLogo, chainName, proposalInfo } = getProposalOverview({
    chainID,
    proposalId,
    isActive,
  });
  const [proposalMarkdown, setProposalMarkdown] = useRemark();
  const { endTime, proposalDescription, proposalTitle } = proposalInfo || {};
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { getChainInfo } = useGetChainInfo();
  const { restURLs: baseURLs, baseURL, govV1 } = getChainInfo(chainID);

  const tallyResult = useAppSelector(
    (state: RootState) =>
      state.gov.chains[chainID]?.tally?.proposalTally?.[proposalId]
  );

  const totalVotes = ['yes', 'no', 'abstain', 'no_with_veto'].reduce(
    (sum, key) =>
      sum +
      Number(get(tallyResult, key, get(tallyResult, `${key}_count`)) || 0),
    0
  );

  useEffect(() => {
    setProposalMarkdown(proposalDescription.replace(/\\n/g, '\n'));
  }, [proposalInfo.proposalTitle]);

  const fetchProposalData = () => {
    dispatch(
      getProposal({
        chainID,
        baseURLs,
        baseURL,
        proposalId: Number(proposalId),
        govV1,
      })
    );
    dispatch(
      getProposalTally({
        chainID,
        baseURLs,
        baseURL,
        proposalId: Number(proposalId),
        govV1,
      })
    );
    dispatch(getPoolInfo({ chainID, baseURLs }));
    dispatch(getDepositParams({ chainID, baseURLs, baseURL }));
    dispatch(getGovTallyParams({ chainID, baseURL, baseURLs }));
  };

  useEffect(() => {
    fetchProposalData();
  }, [chainID, proposalId]);

  const getVotesPercentage = (votesCount: number) => {
    return votesCount && totalVotes
      ? ((votesCount / totalVotes) * 100).toFixed(2)
      : '0';
  };

  const navigateToProposal = () => {
    router.push(`/governance/${chainName}/${proposalId}`);
  };
  const data = [
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count')))
      ),
      count: Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count'))),
      color: 'linear-gradient(90deg, #2ba472 0%, rgba(43, 164, 114, 0.5) 100%)',
      label: 'Yes',
    },
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'no', get(tallyResult, 'no_count')))
      ),
      count: Number(get(tallyResult, 'no', get(tallyResult, 'no_count'))),
      color: 'linear-gradient(90deg, #d92101 0%, rgba(217, 33, 1, 0.5) 100%)',
      label: 'No',
    },
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'abstain', get(tallyResult, 'abstain_count')))
      ),
      count: Number(
        get(tallyResult, 'abstain', get(tallyResult, 'abstain_count'))
      ),
      color: 'linear-gradient(90deg, #ffc13c 0%, rgba(255, 193, 60, 0.5) 100%)',
      label: 'Abstain',
    },
    {
      value: getVotesPercentage(
        Number(
          get(
            tallyResult,
            'no_with_veto',
            get(tallyResult, 'no_with_veto_count')
          )
        )
      ),
      count: Number(
        get(tallyResult, 'no_with_veto', get(tallyResult, 'no_with_veto_count'))
      ),
      color: 'linear-gradient(90deg, #da561e 0%, rgba(218, 86, 30, 0.5) 100%)',
      label: 'Veto',
    },
  ];

  return (
    <div className="pt-6 h-full w-full">
      <div className="proposal-view h-full !w-full">
        <div className="flex flex-col h-full justify-between gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex space-x-1 items-center">
                    <p
                      onClick={navigateToProposal}
                      className="text-h2 max-w-[400px] truncate cursor-pointer hover:underline hover:underline-offset-[3px] font-bold"
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
                  <button
                    className="flex items-center justify-center w-full h-full"
                    onClick={() => onClose({ chainID, proposalId, isActive })}
                  >
                    <Image
                      src="/close.svg"
                      width={24}
                      height={24}
                      alt="close-icon"
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
            <div className="space-y-2">
              <div className="flex justify-between w-full">
                <div className="text-b1">Current Status</div>
                <div className="flex gap-4 items-end">
                  <div className="flex items-center gap-2">
                    <p className="yes-option"></p>
                    <p className="text-[12px] font-extralight">Yes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="no-option"></p>
                    <p className="text-[12px] font-extralight">No</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="abstain-option"></p>
                    <p className="text-[12px] font-extralight">Abstain</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="veto-option"></p>
                    <p className="text-[12px] font-extralight">Veto</p>
                  </div>
                </div>
              </div>
              <div className="w-full relative flex items-center rounded-full overflow-hidden h-2">
                {data.map((v, index) => (
                  <Tooltip key={v.label} title={`${v.label}: ${v.value}%`}>
                    <div
                      className={`h-2`}
                      style={{
                        width: `${v.value}%`,
                        background: v.color,
                        position: index === 0 ? 'relative' : 'absolute',
                        left:
                          index === 0
                            ? '0%'
                            : `${data
                                .slice(0, index)
                                .reduce(
                                  (acc, item) => acc + parseFloat(item.value),
                                  0
                                )}%`,
                      }}
                    ></div>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="flex gap-2 flex-col">
              <div className="text-b1">Summary</div>
              <div className="divider-line"></div>
              <div
                className="secondary-text overflow-y-scroll h-[36vh] proposal-description-markdown"
                style={{
                  padding: 8,
                  whiteSpace: 'pre-line',
                }}
              >
                {proposalMarkdown}
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
                  dispatch(setConnectWalletOpen(true));
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
