import React from 'react';
import Image from 'next/image';
import CustomPieChart from './CustomPiechart';
import './style.css';
import ProposalDetailsCard from './ProposalDetailsCard';

function ProposalOverviewDeposit() {
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
                  #123 | Proposal
                </p>
              </div>
              <div>
                <button className="button">
                  <p className="proposal-text-medium">Deposit</p>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="proposal-text-medium">
              Adjust Trade and Earn Rewards Margined Protocol
            </div>
            <div className="space-y-4">
              <h2 className="proposal-text-medium">Details</h2>
            </div>

            <p className="proposal-text-normal">
              Were proposing (and seeking community funds for) training a
              foundation AI model on Akash Network, resulting in an Akash named
              open source AI model, archived/We re proposing (and seeking
              community funds for) training a foundation AI model on Akash
              Network, resulting in an Akash named open source AI model,
              archived/ shared on Huggingface. The full details can be found in
              the original Github discussion thread here. shared on Huggingface.
              The full details can be found in the original Github We re
              proposing (and seeking community funds for) training a foundation
              AI model on Akash Network, resulting in an Akash named open source
              AI model, archived/ shared on Huggingface. The full details can be
              found in the original Github discussion thread here. discussion
              thread here.
            </p>
            <p className="proposal-text-normal">
              We re proposing (and seeking community funds for) training a
              foundation AI model on Akash Network, resulting in an Akash named
              open sourc.
            </p>
            <p className="proposal-text-normal">
              We re proposing (and seeking community funds for) training a
              foundation AI model on Akash Network, resulting in an Akash named
              opend in the original Github We re proposing (and seeking
              community funds for) training a foundation AI model on Akash
              Network, resulting in an Akash named open source AI model,
              archived/ shared on Huggingface. The full details can be found in
              the original Github discussion thread here. discussion thread
              here.
            </p>
            <h2 className="proposal-text-medium">
              Benefits to the Akash community include:
            </h2>
            <li className="proposal-text-normal">
              Demonstrating that AI model training can be conducted on Akashs
              decentralized cloud platform.
            </li>
            <li className="proposal-text-normal text-white">
              Demonstrating that AI model training can be conducted on Akashs
              decentralized cloud platform.
            </li>
            <li className="proposal-text-normal">
              Demonstrating that AI model training can be conducted on Akashs
              decentralized cloud platform.
            </li>
            <li className="proposal-text-normal">
              Demonstrating that AI model training can be conducted on Akashs
              decentralized cloud platform.
            </li>
          </div>
        </div>
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

         <ProposalDetailsCard />
        </div>
      </div>
    </div>
  );
}

export default ProposalOverviewDeposit;
