'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { RootState } from '@/store/store';
import { useSearchParams, useParams } from 'next/navigation';

import CustomPieChart from './CustomPiechart';
import './style.css';
import ProposalDetailsVoteCard from './ProposalDetailsVoteCard';
import VotePopup from './VotePopup';
import proposalOverviewVoteData from './proposalvoteData.json';

import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getProposal, getGovTallyParams } from '@/store/features/gov/govSlice';
import { get, parseInt } from 'lodash';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';

function parseNumber(value: string | string[]) {
  if (typeof value === 'string') {
    return parseInt(value);
  }

  return 0;
}

const ProposalOverviewVote = () => {
  const [isVotePopupOpen, setVotePopupOpen] = useState(false);
  const toggleVotePopup = () => {
    setVotePopupOpen(!isVotePopupOpen);
  };

  const params = useParams();
  const searchParams = useSearchParams();
  console.log('par', searchParams, params);
  const { govId } = params;
  const proposalId: number = parseNumber(govId);
  const chainID = searchParams.getAll('chainId')[0];

  const dispatch = useAppDispatch();
  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  const networkLogo = useAppSelector(
    (state: RootState) => state.wallet.networks[chainID]?.network.logos.menu
  );
  console.log('proposal info', proposalInfo, chainID);
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const tallyResult = useAppSelector((state: RootState) => {
    if (
      state.gov.chains[chainID] &&
      state.gov.chains[chainID].tally &&
      state.gov.chains[chainID].tally.proposalTally
    ) {
      console.log('tally===', chainID, state.gov.chains);
      return state.gov.chains[chainID].tally.proposalTally[proposalId];
    }
  });

  // const tallyParams = useAppSelector((state: RootState) => state.gov.chains[chainID]?.tallyParams)

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

  const tallyData = [
    {
      value: Number(get(tallyResult, 'yes', 0)) || 0,
      color: '#4AA29C',
      label: 'Yes',
    },
    {
      value: Number(get(tallyResult, 'no', 0)) || 0,
      color: '#E57575',
      label: 'No',
    },
    {
      value: Number(get(tallyResult, 'abstain', 0)) || 0,
      color: '#EFFF34',
      label: 'Abstain',
    },
    {
      value: Number(get(tallyResult, 'no_with_veto', 0)) || 0,
      color: '#EFFF34',
      label: 'Veto',
    },
  ];

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
      color: '#EFFF34',
      label: 'Veto',
    },
  ];

  useEffect(() => {
    const allChainInfo = networks[chainID];
    console.log('here', chainID);
    const chainInfo = allChainInfo.network;
    dispatch(
      getProposal({
        chainID,
        baseURL: chainInfo.config.rest,
        proposalId: proposalId,
      })
    );

    dispatch(getGovTallyParams({ chainID, baseURL: chainInfo.config.rest }));
  }, []);

  return (
    <div className="space-y-6 pl-10 pr-10 pt-6 pb-0">
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
      <div className="flex gap-10">
        <div className="proposal-brief overflow-y-scroll min-h-screen">
          <div className="proposal-div w-full">
            <div className="flex justify-between w-full">
              <div className="flex space-x-2">
                <Image
                  src={networkLogo}
                  width={32}
                  height={32}
                  alt="Network-Logo"
                />
                <p className="proposal-text-normal flex items-center">
                  #{get(proposalInfo, 'proposal_id')} | Proposal
                </p>
              </div>
              <div>
                <button className="button" onClick={toggleVotePopup}>
                  <p className="proposal-text-medium">Vote</p>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="proposal-text-medium">
              {get(proposalInfo, 'content.title')}
            </div>

            <p className="proposal-text-normal">
              {get(proposalInfo, 'content.description')}
            </p>
          </div>
        </div>
        {isVotePopupOpen &&
          get(proposalInfo, 'status') === 'PROPOSAL_STATUS_VOTING_PERIOD' && (
            <>
              <VotePopup
                chainID={chainID}
                votingEndsInDays={getTimeDifferenceToFutureDate(
                  get(proposalInfo, 'voting_end_time')
                )}
                proposalId={proposalId}
                proposalname={get(proposalInfo, 'content.title')}
              />
            </>
          )}
        <div className="space-y-4">
          <div className="status-grid">
            <div className="status-view-grid w-full">
              <div className="status-view w-full">
                <div className="status-pass w-full">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-2 w-full">
                      <Image
                        src="/vote-icon.svg"
                        width={20}
                        height={20}
                        alt="Vote-Icon"
                      />
                      <p className="proposal-text-small">Proposal Projection</p>
                    </div>

                    <p className="text-[#E57575] text-xl font-bold">
                      Will be Rejected
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-start w-full">
                  {tallyData.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 justify-between"
                    >
                      <CustomPieChart
                        value={Number(item.value)}
                        color={item.color}
                        label={item.label}
                      />
                      <div className="proposal-text-extralight">{`${item.value} ${item.label}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="voting-grid">
            <div className="voting-view w-full">
              <div className="status-pass">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-2">
                    <Image
                      src="/vote-icon.svg"
                      width={20}
                      height={20}
                      alt="Vote-Icon"
                    />
                    <p className="proposal-text-small">Total Votes</p>
                  </div>

                  <p className="proposal-text-big">{totalVotes | 0}</p>
                </div>
              </div>
              <div className="w-full text-white flex flex-col justify-center items-center space-y-2">
                <div>Quorum</div>

                <div className="bg-white w-full h-[10px] rounded-full">
                  <div
                    className={
                      `bg-[#2DC5A4] h-[10px] rounded-l-full ` +
                      `w-[${proposalOverviewVoteData.quorum}%]`
                    }
                  ></div>
                </div>
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
                    <div className="proposal-text-extralight">{`${item.value}% ${item.label}`}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ProposalDetailsVoteCard
            createdAt={get(proposalInfo, 'submit_time', '-')}
            startedAt={get(proposalInfo, 'voting_start_time', '-')}
            endsAt={get(proposalInfo, 'voting_end_time', '-')}
            proposalNetwork={chainID}
            createdby={
              proposalOverviewVoteData.proposalOverviewVoteData.createdby
            }
            depositamount={`${get(
              proposalInfo,
              'total_deposit[0].amount'
            )} ${get(proposalInfo, 'total_deposit[0].denom')}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalOverviewVote;
