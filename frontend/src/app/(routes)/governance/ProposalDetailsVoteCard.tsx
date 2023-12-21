'use client';
import { getLocalTime } from '@/utils/dataTime';
import { Tooltip } from '@mui/material';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

import React from 'react';
import { get } from 'lodash';

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
  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  return (
    <div>
      <div className="proposal-details-grid">
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal created </p>
          <Tooltip title={` ${getLocalTime(get(proposalInfo, 'submit_time'))}`}>
            <p>{createdAt}</p>
          </Tooltip>
        </div>

        <div className="proposal-details proposal-text-normal w-full">
          <p>Voting Started </p>
          <Tooltip
            title={` ${getLocalTime(get(proposalInfo, 'voting_start_time'))}`}
          >
            <p>{startedAt}</p>
          </Tooltip>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Voting ends in</p>
          <Tooltip
            title={` ${getLocalTime(get(proposalInfo, 'voting_end_time'))}`}
          >
            <p>{endsAt}</p>
          </Tooltip>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal Network</p>
          <p className="text-capitalize">{proposalNetwork}</p>
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
