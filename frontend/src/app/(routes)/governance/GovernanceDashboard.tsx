import { useState } from 'react';
import './style.css';
const votingPeriod = ['Voting ends in 1 day', 'Voting ends in 2 days'];

const GovernanceDashboard = () => {
  const [selectedVotingPeriod, setSelectedVotingPeriod] = useState(
    'Voting ends in 1 day'
  );
  return (
    <div className="flex items-start gap-10 px-10 py-20">
      <div className="flex flex-col gap-10  w-full">
        <div className="flex flex-col items-start w-full">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal] text-start">
            Governance
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="divider-line"></div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4">
            {votingPeriod.map((data, dataid) => (
              <div
                onClick={() => {
                  setSelectedVotingPeriod(data);
                }}
                key={dataid}
                className={`selected-btns text-white text-base not-italic font-normal leading-[normal] ${data === selectedVotingPeriod ? 'bg-[#ffffff14] border-none' : 'border-[rgba(255,255,255,0.50)]'}`}
              >
                {data}
              </div>
            ))}
          </div>
          <div className=""></div>
        </div>
      </div>
    </div>
  );
};
export default GovernanceDashboard;
