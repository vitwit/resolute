'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import CustomPieChart from './CustomPiechart';
import './style.css';
import ProposalDetailsVoteCard from './ProposalDetailsVoteCard';
import VotePopup from './VotePopup';
import proposalOverviewVoteData from './proposalvoteData.json';

const ProposalOverviewVote = () => {
  const [isVotePopupOpen, setVotePopupOpen] = useState(false);
  const toggleVotePopup = () => {
    setVotePopupOpen(!isVotePopupOpen);
  };

  return (
    <div className="space-y-6 pl-10 pr-0 pt-6 pb-0">
      <div className="flex space-x-1">
        <Image
          src="./backarrow-icon.svg"
          width={24}
          height={24}
          alt="BackArrow-Icon"
          className="cursor-pointer"
        />
        <div className="proposal-text-big">Proposal Overview</div>
      </div>
      <div className="flex gap-10">
        <div className="proposal-brief">
          <div className="proposal-div w-full">
            <div className="flex justify-between w-full">
              <div className="flex space-x-2">
                <Image
                  src="./cosmos-logo.svg"
                  width={40}
                  height={40}
                  alt="Cosmos-Logo"
                />
                <p className="proposal-text-normal flex items-center">
                  {proposalOverviewVoteData.proposalOverviewVoteData.proposalId}{' '}
                  | Proposal
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
              {proposalOverviewVoteData.proposalOverviewVoteData.proposalname}
            </div>

            <p className="proposal-text-normal">
              {proposalOverviewVoteData.proposalOverviewVoteData.proposalText}
            </p>
          </div>
        </div>
        {isVotePopupOpen && (
          <>
            <VotePopup
              chainID=''
              votingEndsInDays={'2'}
              proposalId={123}
              proposalname={'Adjust Trade and Earn Rewards Margined Protocol'}
            />
          </>
        )}
        <div className="space-y-4">
          <div className="status-grid">
            <div className="status-view-grid">
              <div className="status-view">
                <div className="status-pass">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-2 ">
                      <Image
                        src="./vote-icon.svg"
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
                <div>
                  <div className="flex justify-between items-start gap-2">
                    {proposalOverviewVoteData.proposalOverviewVoteData.dataset.map(
                      (item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CustomPieChart
                            value={item.value}
                            color={item.color}
                            label={item.label}
                          />
                          <div className="proposal-text-extralight">{`${item.value}% ${item.label}`}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="voting-grid">
            <div className="voting-view">
              <div className="status-pass">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-2">
                    <Image
                      src="./vote-icon.svg"
                      width={20}
                      height={20}
                      alt="Vote-Icon"
                    />
                    <p className="proposal-text-small">Total Votes</p>
                  </div>

                  <p className="proposal-text-big">
                    {
                      proposalOverviewVoteData.proposalOverviewVoteData
                        .totalvotes
                    }
                  </p>
                </div>
              </div>
              <div className="w-full text-white flex flex-col justify-center items-center space-y-2">
                <div>Quorum</div>

                <div className="bg-white w-full h-[10px] rounded-full">
                  <div
                    className={
                      `bg-[#2DC5A4] h-[10px] rounded-l-full ` +
                      `w-[${proposalOverviewVoteData.proposalOverviewVoteData.quorum}%]`
                    }
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-start gap-2">
                {proposalOverviewVoteData.proposalOverviewVoteData.data.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 justify-between"
                    >
                      <CustomPieChart
                        value={item.value}
                        color={item.color}
                        label={item.label}
                      />
                      <div className="proposal-text-extralight">{`${item.value}% ${item.label}`}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <ProposalDetailsVoteCard
            createdAt={
              proposalOverviewVoteData.proposalOverviewVoteData.createdAt
            }
            startedAt={
              proposalOverviewVoteData.proposalOverviewVoteData.startedAt
            }
            endsAt={proposalOverviewVoteData.proposalOverviewVoteData.endsAt}
            proposalNetwork={
              proposalOverviewVoteData.proposalOverviewVoteData.proposalNetwork
            }
            createdby={
              proposalOverviewVoteData.proposalOverviewVoteData.createdby
            }
            depositamount={
              proposalOverviewVoteData.proposalOverviewVoteData.depositamount
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalOverviewVote;
