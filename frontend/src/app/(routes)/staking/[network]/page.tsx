'use client';

import React from 'react';
import '../staking.css';
import SingleChain from './SingleChain';
// import ChainStaking from './ChainStaking';

const page = ({
  params,
  // searchParams,
}: {
  params: { network: string };
  // searchParams?: { [key: string]: string | undefined };
}) => {
  const { network: paramChain } = params;

  return <SingleChain paramChain={paramChain}   />
  // return <ChainStaking paramChain={paramChain} queryParams={searchParams} />;
};

export default page;
