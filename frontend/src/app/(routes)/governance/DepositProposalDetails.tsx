import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getLocalTime } from '@/utils/dataTime';
import { Tooltip } from '@mui/material';
import { get } from 'lodash';
import React from 'react';

const DepositProposalDetails = ({
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
  const proposalInfo = useAppSelector(
    (state: RootState) => state.gov.proposalDetails
  );
  return (
    <div>
      <div className="proposal-details-grid">
        <div className="proposal-details proposal-text-normal w-full">
          <p>Submitted Time</p>
          <Tooltip title={` ${getLocalTime(get(proposalInfo, 'submit_time'))}`}>
            <p>{submittedAt}</p>
          </Tooltip>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Deposit Period Ends</p>
          <Tooltip
            title={` ${getLocalTime(get(proposalInfo, 'deposit_end_time'))}`}
          >
            <p>{endsAt}</p>
          </Tooltip>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Deposit Required</p>
          <p>{depositrequired}</p>
        </div>
        <div className="proposal-details proposal-text-normal w-full">
          <p>Proposal Network</p>
          <p className="text-capitalize">{proposalNetwork}</p>
        </div>
      </div>
    </div>
  );
};

export default DepositProposalDetails;
