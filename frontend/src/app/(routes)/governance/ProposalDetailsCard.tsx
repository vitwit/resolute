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
      <div className="proposal-details-grid space-y-4">
        <div className="proposal-details proposal-text-normal">
          <p>Submitted Time</p>
          <p>{submittedAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Deposit Period Ends</p>
          <p>{endsAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Deposit Required</p>
          <p>{depositrequired}</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Proposal Network</p>
          <p>{proposalNetwork}</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsCard;
