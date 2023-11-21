'use client';
import React, { useState } from 'react';
import Proposals from './Proposals';
import Image from 'next/image';
import CustomPieChart from './CustomPiechart';
import './style.css';
import AllProposals from './AllProposals';

const RightOverview = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(true);
  const quorum = 50;
  const handleCloseClick = () => {
    console.log('Close button clicked');
    setIsRightBarOpen(false);
  };
  return (
    <div className="w-full flex justify-end">
      <div className="flex-1">
        <Proposals />
        <AllProposals />
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
                    #123 | Proposal
                  </p>
                </div>
                <div className="flex items-center proposal-text-extralight">
                  Voting ends in 2 days
                </div>
              </div>
              <div className="font-bold text-base text-white">
                Introduce Take Rate and deployment deposit for axlUSDC
              </div>
            </div>
            <div className="view-full">View Full Proposal</div>
            <div className="space-y-6">
              <div className="proposal-text-normal">
                Proposal for the partial activation of Aave Governance v3 in an
                interim Aave Governance v2.5 version, wition layer,
                Robot).Proposal for the partial activation of Aave Governance v3
                in an inte2layer, Robot).er ave Governance v3 in an interim Aave
                Governance v2.5 versioancProposal for the partial activation of
                Aave Governance v3 in nce v3 in an inte2layer, GovernancProposal
                for the partial activation of Aave.
              </div>

              <div className="flex justify-between">
                <button className="button">
                  <p className="proposal-text-medium">Vote</p>
                </button>
              </div>
            </div>
          </div>
          <div>
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

                        <p className="proposal-text-big">123,345,876</p>
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
                      <div className="flex items-center gap-2">
                        <CustomPieChart
                          value={75}
                          color="#4AA29C"
                          label="Yes"
                        />
                        <div className="proposal-text-extralight">75% Yes</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomPieChart value={23} color="#E57575" label="No" />
                        <div className="proposal-text-extralight">23% No</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomPieChart
                          value={2}
                          color="#EFFF34"
                          label="Veto"
                        />
                        <div className="proposal-text-extralight">2% Veto</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomPieChart
                          value={0}
                          color="#EFFF34"
                          label="Veto"
                        />
                        <div className="proposal-text-extralight">0% Veto</div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="flex proposal-text-extralight">
                        Proposal submiited on 23rd October 2023
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
