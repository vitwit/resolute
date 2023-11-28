'use client';
import React from 'react';
import Proposals from './Proposals';
import AllProposals from './AllProposals';

const page = () => {
  return (
    <div className="page">
      <Proposals isRightBarOpen={false} />
      <AllProposals isRightBarOpen={false} />
    </div>
  );
};

export default page;
