import React from 'react';

const ProposalDetailsCard = () => {
  return (
    <div>
      <div className="proposal-details-grid space-y-4">
        <div className="proposal-details proposal-text-normal">
          <p>Proposal created at</p>
          <p>23rd October 2023</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Proposal Started at</p>
          <p>24th October 2023</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Proposal ends at</p>
          <p>29th October 2023</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Proposal Network</p>
          <p>Cosmos</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsCard;
