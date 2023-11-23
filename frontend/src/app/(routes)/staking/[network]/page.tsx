import React from 'react';
import '../staking.css';
import ChainStaking from './ChainStaking';

const page = ({ params }: { params: { network: string } }) => {
  const { network: paramChain } = params;

  return <ChainStaking paramChain={paramChain} />;
};

export default page;
