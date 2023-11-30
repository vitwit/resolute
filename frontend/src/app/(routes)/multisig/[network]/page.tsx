import React from 'react';
import ChainMultisig from './ChainMultisig';
import '../multisig.css'

const page = ({ params }: { params: { network: string } }) => {
  const { network: paramChain } = params;

  return <ChainMultisig paramChain={paramChain} />;
};

export default page;
