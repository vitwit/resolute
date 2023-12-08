import React from 'react';

const ProposalDetailsCard = ({
  submittedAt,
  endsAt,
  depositrequired,
  proposalNetwork,
}: {
  submittedAt: string;
  depositrequired: string;
  endsAt: string;
  proposalNetwork: string;
}) => {
  return (
    <div>
      <div className="proposal-details-grid">
        <div className="proposal-details proposal-text-normal w-full">
          <p>Submitted Time</p>
          <p>{submittedAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Deposit Period Ends</p>
          <p>{endsAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Deposit Required</p>
          <p>{depositrequired}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal Network</p>
          <p className='text-capitalize'>{proposalNetwork}</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsCard;
