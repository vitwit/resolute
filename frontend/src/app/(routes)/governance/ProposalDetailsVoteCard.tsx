'use client';
import React from 'react';

const ProposalDetailsVoteCard = ({
  createdAt,
  startedAt,
  endsAt,
  proposalNetwork,
  createdby,
  depositamount,
}: {
  createdAt: string;
  startedAt: string;
  endsAt: string;
  proposalNetwork: string;
  createdby: string;
  depositamount: string;
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
        <div className="proposal-details proposal-text-normal">
          <p>Proposal Created by</p>
          <p>{createdby}</p>
        </div>
        <div className="proposal-details proposal-text-normal">
          <p>Deposit Amount</p>
          <p>{depositamount} </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsVoteCard;
