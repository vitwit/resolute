'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CustomPieChart from './CustomPiechart';
import './style.css';
import VotePopup from './VotePopup';


import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getProposal } from '@/store/features/gov/govSlice';
import { get } from 'lodash';
import { getTimeDifference, getTimeDifferenceToFutureDate } from '@/utils/dataTime';

type handleCloseOverview = () => void;

const RightOverview = ({
  proposalId,
  handleCloseOverview,
  chainID
}: {
  proposalId: number;
  handleCloseOverview: handleCloseOverview;
  chainID: string;
}) => {
  const dispatch = useAppDispatch();
  const proposalInfo = useAppSelector((state: RootState) => state.gov.proposalDetails);
  console.log('proposal info', proposalInfo, chainID)
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const tallyResult = useAppSelector((state: RootState) => state.gov.chains[chainID].tally.proposalTally[proposalId])
  console.log('tallyResult', tallyResult)
  useEffect(() => {
    const allChainInfo = networks[chainID];
    const chainInfo = allChainInfo.network;
    dispatch(getProposal({ chainID, baseURL: chainInfo.config.rest, proposalId: proposalId }))
  }, [proposalId])

  const totalVotes = Number(get(tallyResult, 'yes')) + Number(get(tallyResult, 'no')) +
    Number(get(tallyResult, 'abstain')) + Number(get(tallyResult, 'no_with_veto'))

  const getVotesPercentage = (votesCount: number) => {
    return ((votesCount / totalVotes) * 100).toFixed(2)
  }

  const data = [
    { value: getVotesPercentage(Number(get(tallyResult, 'yes'))), color: '#4AA29C', label: 'Yes' },
    { value: getVotesPercentage(Number(get(tallyResult, 'no'))), color: '#E57575', label: 'No' },
    { value: getVotesPercentage(Number(get(tallyResult, 'abstain'))), color: '#EFFF34', label: 'Abstain' },
    { value: getVotesPercentage(Number(get(tallyResult, 'no_with_veto'))), color: '#EFFF34', label: 'Veto' },
  ];

  const proposalsubmittedOn = getTimeDifference(get(proposalInfo, 'submit_time'));
  const Totalvotes = totalVotes;
  // const proposal = `Proposal for the partial activation of Aave Governance v3 in an
  // interim Aave Governance v2.5 version, wition layer,
  // Robot).Proposal for the partial activation of Aave Governance v3
  // in an inte2layer, Robot).er ave Governance v3 in an interim Aave
  // Governance v2.5 versioancProposal for the partial activation of
  // Aave Governance v3 in nce v3 in an inte2layer, GovernancProposal
  // for the partial activation of Aave.`;
  // const [isRightBarOpen, setIsRightBarOpen] = useState(true);
  const [isVotePopupOpen, setIsVotePopupOpen] = useState(false);
  const toggleVotePopup = () => {
    setIsVotePopupOpen(!isVotePopupOpen);
  };
  const quorum = 50;

  const handleCloseClick = () => {
    setIsRightBarOpen(false);
    handleCloseOverview()
  };
  return (<div>
    {/* // <div className="w-full flex justify-end"> */}
    {/* <div className="flex-1">
        <Proposals isRightBarOpen={isRightBarOpen}/>
        <AllProposals isRightBarOpen={isRightBarOpen}/>
      </div>
      {isRightBarOpen && ( */}

    <div className="right-bar">
      <div className="flex justify-between w-full">
        <div className="proposal-text-main">Proposal Overview</div>
        <Image
          src="./close.svg"
          width={24}
          height={24}
          alt="Close-Icon"
          className="cursor-pointer"
          onClick={handleCloseClick}
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              <Image
                src="./cosmos-logo.svg"
                width={40}
                height={40}
                alt="Comsos-Logo"
              />
              <p className="proposal-text-extralight items-center flex">
                {get(proposalInfo, 'proposal_id')} | Proposal
              </p>
            </div>
            <div className="flex items-center proposal-text-extralight">
              {`Voting ends in ${getTimeDifferenceToFutureDate(get(proposalInfo, 'voting_end_time'))}`}
            </div>
          </div>
          <div className="font-bold text-base text-white">
            {get(proposalInfo, 'content.title')}
          </div>
        </div>
        <div className="view-full">View Full Proposal</div>
        <div className="space-y-6">
          <div className="proposal-text-normal">{get(proposalInfo, 'content.description')}</div>

          <div className="flex justify-between">
            <button className="button" onClick={toggleVotePopup}>
              <p className="proposal-text-medium">Vote</p>
            </button>
          </div>
        </div>
      </div>
      <div>
        {isVotePopupOpen && (
          <>
            <VotePopup
              chainID={chainID}
              votingEndsInDays={getTimeDifferenceToFutureDate(get(proposalInfo, 'voting_end_time'))}
              proposalId={proposalId}
              proposalname={get(proposalInfo, 'content.title')}
            />
          </>
        )}
        <div className="mt-20">
          <div className="space-y-2">
            <div className="vote-grid ">
              <div className="voting-view">
                <div className="status-pass">
                  <div className="flex flex-col items-center">
                    <div className="flex">
                      <Image
                        src="./vote-icon.svg"
                        width={20}
                        height={20}
                        alt="Vote-Icon"
                      />
                      <p className="proposal-text-small">Total Votes</p>
                    </div>

                    <p className="proposal-text-big">{Totalvotes}</p>
                  </div>
                </div>
                <div className="w-full text-white flex flex-col justify-center items-center space-y-2">
                  <div>Quorum</div>

                  <div className="bg-white w-full h-[10px] rounded-full">
                    <div
                      className={
                        `bg-[#2DC5A4] h-[10px] rounded-l-full` +
                        `w-[${quorum}%]`
                      }
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2">
                  {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CustomPieChart
                        value={item.value}
                        color={item.color}
                        label={item.label}
                      />
                      <div className="proposal-text-extralight">{`${item.value}% ${item.label}`}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between w-full">
                  <div className="flex proposal-text-extralight">
                    Proposal submiited on {proposalsubmittedOn}
                  </div>
                  <div className="flex space-x-2">
                    <Image
                      src="./done-icon.svg"
                      width={16}
                      height={16}
                      alt="Done-icon"
                    />
                    <div className="flex proposal-text-extralight">
                      Quorum Reached
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* // )} */}
    {/* </div> */}
  </div>
  );
};

export default RightOverview;
