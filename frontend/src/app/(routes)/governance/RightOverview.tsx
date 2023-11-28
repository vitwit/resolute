'use client';
import React, { useState } from 'react';
import Proposals from './Proposals';
import Image from 'next/image';
import CustomPieChart from './CustomPiechart';
import './style.css';
import AllProposals from './AllProposals';
import VotePopup from './VotePopup';

const RightOverview = ({
  votingEndsInDays,
  proposalId,
  proposalname,
}: {
  votingEndsInDays: number;
  proposalId: string;

  proposalname: string;
}) => {
  const data = [
    { value: 75, color: '#4AA29C', label: 'Yes' },
    { value: 23, color: '#E57575', label: 'No' },
    { value: 2, color: '#EFFF34', label: 'Veto' },
    { value: 0, color: '#EFFF34', label: 'Veto' },
  ];
  const proposalsubmittedOn = '23rd October 2023';
  const Totalvotes = '123,345,876';
  const proposal = `Proposal for the partial activation of Aave Governance v3 in an
  interim Aave Governance v2.5 version, wition layer,
  Robot).Proposal for the partial activation of Aave Governance v3
  in an inte2layer, Robot).er ave Governance v3 in an interim Aave
  Governance v2.5 versioancProposal for the partial activation of
  Aave Governance v3 in nce v3 in an inte2layer, GovernancProposal
  for the partial activation of Aave.`;
  const [isRightBarOpen, setIsRightBarOpen] = useState(true);
  const [isVotePopupOpen, setIsVotePopupOpen] = useState(false);
  const toggleVotePopup = () => {
    setIsVotePopupOpen(!isVotePopupOpen);
  };
  const quorum = 50;
  
  const handleCloseClick = () => {
    setIsRightBarOpen(false);
  };
  return (
    <div className="w-full flex justify-end">
      <div className="flex-1">
        <Proposals isRightBarOpen={isRightBarOpen}/>
        <AllProposals isRightBarOpen={isRightBarOpen}/>
      </div>
      {isRightBarOpen && (
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
                    {proposalId} | Proposal
                  </p>
                </div>
                <div className="flex items-center proposal-text-extralight">
                  {`Voting ends in ${votingEndsInDays} days`}
                </div>
              </div>
              <div className="font-bold text-base text-white">
                {proposalname}
              </div>
            </div>
            <div className="view-full">View Full Proposal</div>
            <div className="space-y-6">
              <div className="proposal-text-normal">{proposal}</div>

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
              votingEndsInDays={2}
              proposalId={123}
              proposalname={'Adjust Trade and Earn Rewards Margined Protocol'}
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
      )}
    </div>
  );
};

export default RightOverview;
