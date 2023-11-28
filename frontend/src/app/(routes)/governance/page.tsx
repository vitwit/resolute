import React from 'react';
import Proposals from './Proposals';
import AllProposals from './AllProposals';

const page = () => {
  const proposalId ="#123";
  const votingEndsInDays=3;
  const proposalname="vcbs cnbsxbc";
  return (
    <div className="page">
      <Proposals isRightBarOpen={false}/>
      <AllProposals isRightBarOpen={false}/>
    
    </div>
  );
};

export default page;
