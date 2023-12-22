'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CustomPieChart from './CustomPiechart';
import './style.css';
import VotePopup from './VotePopup';
import { CircularProgress, Tooltip } from '@mui/material';
import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getGovTallyParams, getProposal } from '@/store/features/gov/govSlice';
import { get } from 'lodash';
import {
  getTimeDifference,
  getTimeDifferenceToFutureDate,
} from '@/utils/dataTime';
import DepositPopup from './DepositPopup';
import { getPoolInfo } from '@/store/features/staking/stakeSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { deepPurple } from '@mui/material/colors';
import DepositProposalInfo from './DepositProposalInfo';
import DepositProposalDetails from './DepositProposalDetails';
import { formatCoin } from '@/utils/util';

type handleCloseOverview = () => void;

const RightOverview = ({
  proposalId,
  handleCloseOverview,
  chainID,
  status,
  handleProposalSelected,
}: {
  proposalId: number;
  handleCloseOverview: handleCloseOverview;
  chainID: string;
  status: string;
  handleProposalSelected: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const tallyResult = useAppSelector(
    (state: RootState) =>
      state.gov.chains[chainID].tally.proposalTally[proposalId]
  );

  const isStatusVoting =
    get(proposalInfo, 'status') === 'PROPOSAL_STATUS_VOTING_PERIOD';
  const { getChainInfo } = useGetChainInfo();
  const { chainName } = getChainInfo(chainID);

  useEffect(() => {
    const allChainInfo = networks[chainID];
    const chainInfo = allChainInfo.network;
    dispatch(
      getProposal({
        chainID,
        baseURL: chainInfo.config.rest,
        proposalId: proposalId,
      })
    );
    dispatch(
      getGovTallyParams({
        chainID,
        baseURL: chainInfo.config.rest,
      })
    );
    dispatch(
      getPoolInfo({
        baseURL: chainInfo.config.rest,
        chainID: chainID,
      })
    );
  }, [proposalId]);

  const poolInfo = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.pool
  );
  const tallyParams = useAppSelector(
    (state: RootState) =>
      state.gov.chains[chainID]?.tallyParams.params.tally_params
  );
  const proposalLoadingStatus = useAppSelector(
    (state: RootState) => state.gov.proposalInfo.status
  );
  const quorumRequired = (parseFloat(tallyParams.quorum) * 100).toFixed(1);

  const totalVotes =
    Number(get(tallyResult, 'yes')) +
    Number(get(tallyResult, 'no')) +
    Number(get(tallyResult, 'abstain')) +
    Number(get(tallyResult, 'no_with_veto'));

  const getVotesPercentage = (votesCount: number) => {
    return ((votesCount / totalVotes) * 100).toFixed(2);
  };
  const maxCharacters = 300;
  const truncatedDescription = get(
    proposalInfo,
    'content.description',
    ''
  ).slice(0, maxCharacters);
  const isDescriptionTruncated =
    truncatedDescription.length <
    get(proposalInfo, 'content.description', '').length;

  const data = [
    {
      value: getVotesPercentage(Number(get(tallyResult, 'yes'))),
      color: '#4AA29C',
      label: 'Yes',
    },
    {
      value: getVotesPercentage(Number(get(tallyResult, 'no'))),
      color: '#E57575',
      label: 'No',
    },
    {
      value: getVotesPercentage(Number(get(tallyResult, 'abstain'))),
      color: '#EFFF34',
      label: 'Abstain',
    },
    {
      value: getVotesPercentage(Number(get(tallyResult, 'no_with_veto'))),
      color: '#5885AF',
      label: 'Veto',
    },
  ];

  const proposalSubmittedOn = getTimeDifference(
    get(proposalInfo, 'submit_time')
  );

  // const Totalvotes = totalVotes.toLocaleString();
  const [depositRequired] = useState(0);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const [isVotePopupOpen, setIsVotePopupOpen] = useState(false);
  const handleCloseVotePopup = () => {
    setIsVotePopupOpen(false);
  };
  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };
  const currency = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID]?.network.config.currencies[0]
  );
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);
  const handleCloseDepositPopup = () => {
    setIsDepositPopupOpen(false);
  };

  const handleCloseClick = () => {
    handleCloseOverview();
  };

  const [quorumPercent, setQuorumPercent] = useState<string>('0');
  useEffect(() => {
    if (poolInfo?.bonded_tokens) {
      const value = totalVotes / parseInt(poolInfo.bonded_tokens);
      setQuorumPercent((value * 100).toFixed(1));
    }
  }, [poolInfo]);

  return (
    <div>
      <div className="right-bar">
        <div className="flex justify-between w-full">
          <div className="proposal-text-main">Proposal Overview</div>
          <Image
            src="/close-icon.svg"
            width={24}
            height={24}
            alt="Close icon"
            className="cursor-pointer"
            onClick={() => {
              handleCloseClick();
              handleProposalSelected(false);
            }}
          />
        </div>
        {proposalLoadingStatus !== 'pending' ? (
          <>
            <div className="flex-1 flex flex-col space-y-16">
              <div className="space-y-4 w-full">
                <div className="space-y-3">
                  <div className="flex justify-between w-full">
                    <div className="flex space-x-2">
                      <Image
                        src={networkLogo}
                        width={32}
                        height={32}
                        alt="Network Logo"
                      />

                      <p className="items-center flex space-x-1 text-[14px] font-bold">
                        #{get(proposalInfo, 'proposal_id')}
                      </p>
                      <p className="proposal-text-extralight items-center flex">
                        | Proposal
                      </p>
                    </div>
                    <div className="flex items-center proposal-text-extralight">
                      {status === 'active' ? (
                        <>
                          {`Voting ends in ${getTimeDifferenceToFutureDate(
                            get(proposalInfo, 'voting_end_time')
                          )}`}
                        </>
                      ) : (
                        <>
                          {`Deposit period ends in ${getTimeDifferenceToFutureDate(
                            get(proposalInfo, 'deposit_end_time')
                          )}`}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-base text-white">
                    {get(proposalInfo, 'content.title') ||
                      get(proposalInfo, 'content.@type')}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="proposal-text-normal">
                    {truncatedDescription}
                    {isDescriptionTruncated && '...'}
                  </div>
                  <div className="flex space-x-6">
                    <button
                      className="button"
                      onClick={() => {
                        if (isStatusVoting) {
                          setIsVotePopupOpen(true);
                        } else {
                          setIsDepositPopupOpen(true);
                        }
                      }}
                    >
                      <p className="proposal-text-medium">
                        {isStatusVoting ? 'Vote' : 'Deposit'}
                      </p>
                    </button>
                    <div className="view-full">
                      <Link href={`/governance/${chainName}/${proposalId}`}>
                        View Full Proposal
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <VotePopup
                  chainID={chainID}
                  votingEndsInDays={getTimeDifferenceToFutureDate(
                    get(proposalInfo, 'voting_end_time')
                  )}
                  proposalId={proposalId}
                  proposalname={get(proposalInfo, 'content.title')}
                  open={isVotePopupOpen}
                  onClose={handleCloseVotePopup}
                  networkLogo={networkLogo}
                />

                <DepositPopup
                  chainID={chainID}
                  votingEndsInDays={getTimeDifferenceToFutureDate(
                    get(proposalInfo, 'deposit_end_time')
                  )}
                  proposalId={proposalId}
                  proposalname={get(proposalInfo, 'content.title')}
                  onClose={handleCloseDepositPopup}
                  open={isDepositPopupOpen}
                  networkLogo={networkLogo}
                />
              </div>
              {isStatusVoting ? (
                <div className="space-y-4 w-full">
                  <div className="vote-grid space-y-4">
                    <div className="voting-view w-full">
                      <div className="w-full  text-white flex flex-col justify-center items-center space-y-4">
                        <div className="text-[20px]">Quorum</div>

                        {quorumPercent ? (
                          <Tooltip title={`${quorumPercent}%`}>
                            <div className="flex w-full flex-col">
                              <div className="flex flex-col items-center">
                                <div>
                                  {quorumPercent}/{quorumRequired}
                                </div>
                                <div className="bg-[#f0f0f3] h-[10px] w-[2px]"></div>
                              </div>
                              <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                                <div className="bg-[#f0f0f3] h-[10px] w-[2px] absolute  flex left-[225px]"></div>
                                <div
                                  style={{ width: `${quorumPercent}%` }}
                                  className={`bg-[#2DC5A4] h-[10px] rounded-l-full`}
                                ></div>
                              </div>
                            </div>
                          </Tooltip>
                        ) : null}
                      </div>

                      <div className="flex justify-between items-start w-full">
                        {data.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center gap-2"
                          >
                            <CustomPieChart
                              value={parseInt(item.value)}
                              color={item.color}
                              label={item.label}
                            />
                            <div className="proposal-text-extralight">{`${Math.floor(
                              parseFloat(item.value)
                            )}% ${item.label}`}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex proposal-text-extralight">
                          Submitted on {proposalSubmittedOn}
                        </div>
                        <div className="flex space-x-2">
                          <Image
                            src="/done-icon.svg"
                            width={16}
                            height={16}
                            alt="Quorum reached icon"
                          />
                          <div className="flex proposal-text-extralight">
                            {parseFloat(quorumPercent) >=
                            parseFloat(quorumRequired)
                              ? 'Quorum Reached'
                              : 'Quorum Not Reached'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-20">
                  <div className="bg-[#FFFFFF0D] rounded-2xl">
                    <DepositProposalInfo chainID={chainID} />
                  </div>
                  <div className="bg-[#FFFFFF0D] rounded-2xl">
                    <DepositProposalDetails
                      submittedAt={getTimeDifferenceToFutureDate(
                        get(proposalInfo, 'submit_time', '-'),
                        true
                      )}
                      endsAt={getTimeDifferenceToFutureDate(
                        get(proposalInfo, 'deposit_end_time', '-')
                      )}
                      depositrequired={formatCoin(
                        depositRequired,
                        currency.coinDenom
                      )}
                      proposalNetwork={getChainName(chainID)}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-[20%] flex items-center">
            <CircularProgress size={36} sx={{ color: deepPurple[600] }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RightOverview;
