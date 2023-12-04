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
      <div className="proposal-details-grid">
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal created at</p>
          <p>{createdAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal Started at</p>
          <p>{startedAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal ends at</p>
          <p>{endsAt}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal Network</p>
          <p>{proposalNetwork}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal Created by</p>
          <p>{createdby}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Deposit Amount</p>
          <p>{depositamount} </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsVoteCard;
