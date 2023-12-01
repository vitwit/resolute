import React from 'react';
import '../staking.css';
import ChainStaking from './ChainStaking';

const page = ({
  params,
  searchParams,
}: {
  params: { network: string };
  searchParams?: { [key: string]: string | undefined };
}) => {
  const { network: paramChain } = params;

  return <ChainStaking paramChain={paramChain} queryParams={searchParams} />;
};

export default page;
