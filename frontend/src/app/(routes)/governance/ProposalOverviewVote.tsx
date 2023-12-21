'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { RootState } from '@/store/store';
import CustomPieChart from './CustomPiechart';
import './style.css';
import ProposalDetailsVoteCard from './ProposalDetailsVoteCard';
import VotePopup from './VotePopup';

import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getProposal,
  getGovTallyParams,
  getProposalTally,
  getDepositParams,
} from '@/store/features/gov/govSlice';
import { get, parseInt } from 'lodash';
import { getLocalTime, getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { parseBalance } from '@/utils/denom';

import { formatCoin } from '@/utils/util';
import { getPoolInfo } from '@/store/features/staking/stakeSlice';
import { Tooltip } from '@mui/material';
import DepositProposalDetails from './DepositProposalDetails';
import DepositProposalInfo from './DepositProposalInfo';
import DepositPopup from './DepositPopup';
import { setSelectedNetwork } from '@/store/features/common/commonSlice';
import ProposalProjection from './ProposalProjection';
import TopNav from '@/components/TopNav';

const emptyTallyResult = {
  yes: '',
  abstain: '',
  no: '',
  no_with_veto: '',
  proposal_id: '',
};

const ProposalOverviewVote = ({
  chainName,
  proposalId,
}: {
  chainName: string;
  proposalId: number;
}) => {
  const [depositRequired, setDepositRequired] = useState(0);
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainID = nameToChainIDs[chainName];

  const dispatch = useAppDispatch();
  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  const isStatusVoting =
    get(proposalInfo, 'status') === 'PROPOSAL_STATUS_VOTING_PERIOD';
  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );
  const currency = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID]?.network.config.currencies[0]
  );
  const depositParams = useAppSelector(
    (state: RootState) => state.gov.chains[chainID]?.depositParams.params
  );

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const tallyResult = useAppSelector((state: RootState) => {
    if (
      state.gov.chains[chainID] &&
      state.gov.chains[chainID].tally &&
      state.gov.chains[chainID].tally.proposalTally
    ) {
      return state.gov.chains[chainID].tally.proposalTally[proposalId];
    }
  });
  const poolInfo = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.pool
  );
  const tallyParams = useAppSelector(
    (state: RootState) =>
      state.gov.chains[chainID]?.tallyParams.params.tally_params
  );
  const quorumRequired = (parseFloat(tallyParams?.quorum) * 100).toFixed(1);

  const totalVotes =
    Number(get(tallyResult, 'yes')) +
    Number(get(tallyResult, 'no')) +
    Number(get(tallyResult, 'abstain')) +
    Number(get(tallyResult, 'no_with_veto'));

  const getVotesPercentage = (votesCount: number) => {
    return (
      (votesCount &&
        totalVotes &&
        ((votesCount / totalVotes) * 100).toFixed(2)) ||
      0
    );
  };

  const formattedTotalVotes = totalVotes.toLocaleString();

  const data = [
    {
      value: getVotesPercentage(Number(get(tallyResult, 'yes', 0))) || 0,
      color: '#4AA29C',
      label: 'Yes',
    },
    {
      value: getVotesPercentage(Number(get(tallyResult, 'no', 0))) || 0,
      color: '#E57575',
      label: 'No',
    },
    {
      value: getVotesPercentage(Number(get(tallyResult, 'abstain', 0))) || 0,
      color: '#EFFF34',
      label: 'Abstain',
    },
    {
      value:
        getVotesPercentage(Number(get(tallyResult, 'no_with_veto', 0))) || 0,
      color: '#5885AF',
      label: 'Veto',
    },
  ];

  const getChainName = (chainID: string) => {
    let chain: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainID) chain = chainName;
    });
    return chain;
  };

  const [isVotePopupOpen, setIsVotePopupOpen] = useState(false);
  const handleCloseVotePopup = () => {
    setIsVotePopupOpen(false);
  };

  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);
  const handleCloseDepositPopup = () => {
    setIsDepositPopupOpen(false);
  };

  useEffect(() => {
    const allChainInfo = networks[chainID];
    const chainInfo = allChainInfo?.network;
    dispatch(
      getProposal({
        chainID,
        baseURL: chainInfo?.config.rest,
        proposalId: proposalId,
      })
    );

    dispatch(
      getProposalTally({
        baseURL: chainInfo?.config.rest,
        proposalId,
        chainID: chainID,
      })
    );

    dispatch(
      getPoolInfo({
        baseURL: chainInfo?.config.rest,
        chainID: chainID,
      })
    );

    dispatch(
      getDepositParams({
        baseURL: chainInfo?.config.rest,
        chainID: chainID,
      })
    );

    dispatch(getGovTallyParams({ chainID, baseURL: chainInfo?.config.rest }));
  }, []);

  const [quorumPercent, setQuorumPercent] = useState<string>('0');
  useEffect(() => {
    if (poolInfo?.bonded_tokens) {
      const value = totalVotes / parseInt(poolInfo.bonded_tokens);
      setQuorumPercent((value * 100).toFixed(1));
    }
  }, [poolInfo]);

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
      // const deposit_percent = Math.floor((total_deposit / min_deposit) * 100);
      const deposit_required = min_deposit - total_deposit;
      setDepositRequired(deposit_required);
    }
  }, [depositParams, proposalInfo]);

  useEffect(() => {
    if (chainName?.length) {
      dispatch(setSelectedNetwork({ chainName: chainName }));
    }
  }, [chainName]);

  return (
    <div className=" px-10 py-6">
      <div className="flex gap-10 h-screen">
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex space-y-10 flex-col">
            <div className="proposal-text-big">Governance</div>

            <div className="flex space-x-1">
              <Link href="/governance">
                <Image
                  src="/backarrow-icon.svg"
                  width={24}
                  height={24}
                  alt="BackArrow"
                  className="cursor-pointer"
                />
              </Link>

              <div className="proposal-text-big">Proposal Overview</div>
            </div>
          </div>
          <div className="proposal-brief overflow-y-scroll flex flex-1">
            <div className="proposal-div w-full">
              <div className="flex justify-between w-full">
                <div className="flex space-x-2 items-center">
                  <Image
                    className="w-[32px] h-[32px]"
                    src={networkLogo}
                    width={32}
                    height={32}
                    alt="Network-Logo"
                  />
                  <p className="font-bold text-[16px] flex items-center">
                    #{get(proposalInfo, 'proposal_id')} | Proposal
                  </p>
                </div>
                <div>
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
                </div>
              </div>
            </div>
            <div className="space-y-6 mt-4">
              <div className="font-bold text-[20px] leading-6">
                <ReactMarkdown>
                  {get(proposalInfo, 'content.title') ||
                    get(proposalInfo, 'content.@type')}
                </ReactMarkdown>
              </div>

              <ReactMarkdown className="text-[#FFFFFFCC] leading-6 text-[16px]">
                {get(proposalInfo, 'content.description')}
              </ReactMarkdown>
            </div>
          </div>

          <VotePopup
            chainID={chainID}
            votingEndsInDays={getTimeDifferenceToFutureDate(
              get(proposalInfo, 'voting_end_time')
            )}
            open={isVotePopupOpen}
            onClose={handleCloseVotePopup}
            proposalId={proposalId}
            proposalname={get(proposalInfo, 'content.title')}
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
          <div className="flex justify-between">
            <div className="space-y-4">
              <div className="flex space-y-[68px] flex-col">
                <div className="w-[412px]">
                  <TopNav />
                </div>

                <div className="status-grid w-[450px]">
                  <div className=" w-full">
                    <div className="w-full">
                      <div className="status-pass w-full">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex space-x-2 w-full justify-center">
                            <Image
                              src="/vote-icon.svg"
                              width={20}
                              height={20}
                              alt="Vote-Icon"
                            />
                            <p className="proposal-text-small">
                              Proposal Projection
                            </p>
                          </div>
                          <div>
                            <ProposalProjection
                              quorumReached={
                                parseFloat(quorumPercent) >=
                                parseFloat(quorumRequired)
                              }
                              quorumPercent={quorumPercent}
                              quorumRequired={quorumRequired}
                              totalVotes={totalVotes}
                              tallyResult={tallyResult || emptyTallyResult}
                            />
                          </div>
                        </div>
                      </div>

                      {/* TODO: Write explaination for proposal Rejected */}
                      <div className="flex justify-between items-start w-full">
                        {''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="voting-grid bg-[#0E0B26]">
                <div className="voting-view w-full">
                  <div className="w-full text-white flex flex-col justify-center items-center space-y-2">
                    <div className='text-[20px]'>Quorum</div>

                    {quorumPercent ? (
                      <Tooltip title={`${quorumPercent}%`}>
                        <div className="flex w-full flex-col">
                          <div className="flex flex-col items-center">
                            <div>
                              {quorumPercent}/{quorumRequired}
                            </div>
                            <div className="bg-[#f0f0f3] h-[10px] w-[1px]"></div>
                          </div>
                          <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
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
                        className="flex flex-col items-center gap-2 justify-between"
                      >
                        <CustomPieChart
                          value={Number(item.value)}
                          color={item.color}
                          label={item.label}
                        />
                        <div className="proposal-text-extralight">{`${Math.floor(
                          parseFloat(String(item.value))
                        )}% ${item.label}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <ProposalDetailsVoteCard
                createdAt={getLocalTime(get(proposalInfo, 'submit_time', '-'))}
                startedAt={getLocalTime(
                  get(proposalInfo, 'voting_start_time', '-')
                )}
                endsAt={getLocalTime(get(proposalInfo, 'voting_end_time', '-'))}
                proposalNetwork={getChainName(chainID)}
                createdby={'-'}
                // depositamount={`${get(
                //   proposalInfo,
                //   'total_deposit[0].amount'
                // )} ${get(proposalInfo, 'total_deposit[0].denom')}`}
                depositamount={formatCoin(
                  parseBalance(
                    get(proposalInfo, 'total_deposit', []),
                    currency?.coinDecimals,
                    currency?.coinMinimalDenom
                  ),
                  currency?.coinDenom
                )}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-[480px] flex-end">
            <div className="space-y-4 w-full">
              <div className="flex space-y-[68px] flex-col">
                <div className="w-[412px]">
                  <TopNav />
                </div>
                <div className="bg-[#0E0B26] rounded-2xl">
                  <DepositProposalInfo chainID={chainID} />
                </div>
              </div>
              <DepositProposalDetails
                submittedAt={getLocalTime(
                  get(proposalInfo, 'submit_time', '-')
                )}
                endsAt={getLocalTime(
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
    </div>
  );
};

export default ProposalOverviewVote;
