import React from 'react';

const ProposalDetailsCard = ({
  createdAt,
  startedAt,
  endsAt,
  proposalNetwork,
}: {
  createdAt: string;
  startedAt: string;
  endsAt: string;
  proposalNetwork: string;
}) => {
  return (
    <div>
      <div className="proposal-details-grid space-y-4">
        <div className="proposal-details proposal-text-normal">
          <p>Proposal created at</p>
          <p>{createdAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Proposal Started at</p>
          <p>{startedAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Proposal ends at</p>
          <p>{endsAt}</p>
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
