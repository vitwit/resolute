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
import {
  getDepositParams,
  getGovTallyParams,
  getProposal,
  getProposalTally,
} from '@/store/features/gov/govSlice';
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
import { parseBalance } from '@/utils/denom';

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

  const [depositRequired, setDepositRequired] = useState(0);

  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );
  const depositParams = useAppSelector(
    (state: RootState) => state.gov.chains[chainID]?.depositParams.params
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
    const govV1 = chainInfo.govV1;
    dispatch(
      getProposal({
        chainID,
        baseURLs: chainInfo?.config.restURIs,
        baseURL: chainInfo.config.rest,
        proposalId: proposalId,
        govV1: govV1,
      })
    );

    dispatch(
      getProposalTally({
        baseURL: chainInfo?.config.rest,
        baseURLs: chainInfo?.config.restURIs,
        proposalId,
        chainID: chainID,
        govV1,
      })
    );

    dispatch(
      getGovTallyParams({
        chainID,
        baseURL: chainInfo.config.rest,
        baseURLs: chainInfo?.config.restURIs,
      })
    );

    dispatch(
      getPoolInfo({
        baseURLs: chainInfo.config.restURIs,
        chainID: chainID,
      })
    );

    dispatch(
      getDepositParams({
        baseURLs: chainInfo?.config.restURIs,
        baseURL: chainInfo?.config.rest,
        chainID: chainID,
      })
    );
  }, [proposalId, chainID]);

  useEffect(() => {
    if (
      depositParams?.min_deposit?.length &&
      proposalInfo?.total_deposit?.length
    ) {
      const min_deposit = parseBalance(
        depositParams.min_deposit,
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      const total_deposit = parseBalance(
        proposalInfo.total_deposit,
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      const deposit_required = min_deposit - total_deposit;
      setDepositRequired(deposit_required);
    }
  }, [depositParams, proposalInfo]);

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
    Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count')) || 0) +
      Number(get(tallyResult, 'no', get(tallyResult, 'no_count')) || 0) +
      Number(
        get(tallyResult, 'abstain', get(tallyResult, 'abstain_count')) || 0
      ) +
      Number(
        get(
          tallyResult,
          'no_with_veto',
          get(tallyResult, 'no_with_veto_count')
        ) || 0
      ) || 0;

  const getVotesPercentage = (votesCount: number) => {
    return ((votesCount / totalVotes) * 100).toFixed(2);
  };
  const maxCharacters = 300;
  const truncatedDescription = get(
    proposalInfo,
    'content.description',
    get(proposalInfo, 'summary', '')
  ).slice(0, maxCharacters);
  const isDescriptionTruncated =
    truncatedDescription.length <
    get(proposalInfo, 'content.description', get(proposalInfo, 'summary', ''))
      .length;

  const data = [
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count')) || 0)
      ),
      color: '#4AA29C',
      label: 'Yes',
    },
    {
      value: getVotesPercentage(
        Number(get(tallyResult, 'no', get(tallyResult, 'no_count')) || 0)
      ),
      color: '#E57575',
      label: 'No',
    },
    {
      value: getVotesPercentage(
        Number(
          get(tallyResult, 'abstain', get(tallyResult, 'abstain_count')) || 0
        )
      ),
      color: '#EFFF34',
      label: 'Abstain',
    },
    {
      value: getVotesPercentage(
        Number(
          get(
            tallyResult,
            'no_with_veto',
            get(tallyResult, 'no_with_veto_count' || 0)
          )
        )
      ),
      color: '#5885AF',
      label: 'Veto',
    },
  ];

  const proposalSubmittedOn = getTimeDifference(
    get(proposalInfo, 'submit_time')
  );
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
            <div className="flex justify-between h-full w-full">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 w-full">
                  <div className="space-y-3">
                    <div className="flex justify-between w-full">
                      <div className="flex space-x-2">
                        <Image
                          className="rounded-full"
                          src={networkLogo}
                          width={32}
                          height={32}
                          alt="Network Logo"
                        />

                        <p className="items-center flex space-x-1 text-[14px] font-bold opacity-50">
                          #{' '}
                          {get(
                            proposalInfo,
                            'proposal_id',
                            get(proposalInfo, 'id')
                          )}
                        </p>
                        {/* <p className="proposal-text-extralight items-center flex"></p> */}
                      </div>
                      <div className="flex items-center proposal-text-extralight opacity-90">
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
                    <div className="font-bold text-base text-white max-w-[450px] whitespace-normal break-words">
                      {get(
                        proposalInfo,
                        'content.title',
                        get(proposalInfo, 'title')
                      ) ||
                        get(
                          proposalInfo,
                          'content.@type',
                          get(proposalInfo, 'message[0].@type', '')
                        )}
                    </div>
                  </div>

                  <div className="space-y-6 max-w-[450px]">
                    <div className="proposal-text-normal whitespace-normal break-words">
                      {truncatedDescription}
                      {isDescriptionTruncated && '...'}
                    </div>
                    <div className="flex space-x-6">
                      <button
                        className="primary-custom-btn"
                        onClick={() => {
                          if (isStatusVoting) {
                            setIsVotePopupOpen(true);
                          } else {
                            setIsDepositPopupOpen(true);
                          }
                        }}
                      >
                        <p>{isStatusVoting ? 'Vote' : 'Deposit'}</p>
                      </button>
                      <div className="underline underline-offset-[3px] font-medium justify-center  flex items-center">
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
                  <div className="space-y-6 w-full">
                    <div className="vote-grid space-y-6">
                      <div className="voting-view w-full">
                        <div className="w-full  text-white flex flex-col justify-center items-center space-y-6">
                          <div className="text-[20px]">Quorum</div>

                          {quorumPercent ? (
                            <Tooltip title={`${quorumPercent}%`}>
                              <div className="flex w-full flex-col ">
                                <div
                                  style={{
                                    width: `${quorumPercent.toString()}%`,
                                  }}
                                ></div>
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="flex flex-row space-x-2">
                                    <div className="flex-row flex space-x-2">
                                      <div className="items-center flex font-bold">
                                        Turnout{' '}
                                      </div>

                                      <div className="bg-[#FFFFFF0D] rounded-lg flex items-center gap-2 opacity-80 text-white text-center px-2 py-2 w-[52px] h-[30px] text-sm">
                                        {quorumPercent}%
                                      </div>
                                    </div>
                                    <div className="flex items-center">/</div>
                                    <div className="flex-row flex space-x-2">
                                      <div className="items-center flex font-bold">
                                        Quorum{' '}
                                      </div>

                                      <div className="bg-[#FFFFFF0D] rounded-lg flex items-center gap-2 opacity-80 text-white text-center  px-2 py-2  w-[55px] h-[30px] text-sm">
                                        {quorumRequired}%
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-[#f0f0f3] h-[10px] w-[4px]"></div>
                                </div>
                                <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
                                  <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex left-[224px]"></div>
                                  <div
                                    style={{ width: `${quorumPercent}%` }}
                                    className={`bg-[#2DC5A4] h-[10px] rounded-l-full `}
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
                                value={parseInt(item.value) || 0}
                                color={item.color}
                                label={item.label}
                              />
                              <div className="proposal-text-extralight">{`${Math.floor(
                                parseFloat(item.value) || 0
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
                  <div className="flex flex-col space-y-10">
                    <div className="bg-[#FFFFFF0D] rounded-2xl">
                      <DepositProposalInfo chainID={chainID} />
                    </div>
                    <div className="bg-[#FFFFFF0D] rounded-2xl">
                      <DepositProposalDetails
                        submittedAt={`${getTimeDifferenceToFutureDate(
                          get(proposalInfo, 'submit_time', '-'),
                          true
                        )} ago`}
                        endsAt={`in ${getTimeDifferenceToFutureDate(
                          get(proposalInfo, 'deposit_end_time', '-')
                        )}`}
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
