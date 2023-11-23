'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import CustomPieChart from './CustomPiechart';
import './style.css';
import ProposalDetailsCard from './ProposalDetailsCard';
import DepositPopup from './DepositPopup';

const ProposalOverviewDeposit = ({
  proposalId,
  proposalText,
  proposalname,
}: {
  proposalId: string;
  proposalText: string;
  proposalname: string;
}) => {
  const [isDepositPopupOpen, setDepositPopupOpen] = useState(false);
  const toggleDepositPopup = () => {
    setDepositPopupOpen(!isDepositPopupOpen);
  };
  const data = [
    { value: 75, color: '#4AA29C', label: 'Yes' },
    { value: 23, color: '#E57575', label: 'No' },
    { value: 2, color: '#EFFF34', label: 'Veto' },
    { value: 0, color: '#EFFF34', label: 'Veto' },
  ];
  const dataset = [
    { value: 75, color: '#759BE5', label: 'Quorum' },
    { value: 23, color: '#75E5A2', label: 'Turn out' },
    { value: 2, color: '#B373CA', label: 'Threhold' },
  ];
  const quorum = 50;
  const createdAt = '23rd October 2023';
  const startedAt = '24th October 2023';
  const endsAt = '29th October 2023';
  const proposalNetwork = 'Cosmos';
  const atomsValue = 'ATOMS';
  return (
    <div className="space-y-6 pl-10 pr-0 pt-6 pb-0">
      <div>topnav</div>

      <div className="flex space-x-1">
        <Image
          src="./backarrow-icon.svg"
          width={24}
          height={24}
          alt="Go Back"
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
                  {proposalId} | Proposal
                </p>
              </div>
              <div>
                <button className="button" onClick={toggleDepositPopup}>
                  <p className="proposal-text-medium">Deposit</p>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="proposal-text-medium">{proposalname}</div>

            <p className="proposal-text-normal">{proposalText}</p>
          </div>
        </div>
        {isDepositPopupOpen && (
          <>
            <DepositPopup votingEndsInDays={2} denom={atomsValue} proposalId={123} proposalname={"Adjust Trade and Earn Rewards Margined Protocol"} />
          </>
        )}
        <div className="space-y-4">
          <div className="status-grid">
            <div className="status-view-grid">
              <div className="status-view">
                <div className="status-pass">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-2">
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
                    {dataset.map((item, index) => (
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
                </div>
              </div>
            </div>
          </div>
          <div className="voting-grid">
            <div className="voting-view">
              <div className="status-pass">
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-2 ">
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
                      `bg-[#2DC5A4] h-[10px] rounded-l-full ` + `w-[${quorum}%]`
                    }
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-start gap-2 w-full">
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
            </div>
          </div>

          <ProposalDetailsCard
            createdAt={createdAt}
            startedAt={startedAt}
            endsAt={endsAt}
            proposalNetwork={proposalNetwork}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalOverviewDeposit;
