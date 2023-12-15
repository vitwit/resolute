import React from 'react';
import ChainMultisig from './ChainMultisig';
import '../multisig.css';

const page = ({ params }: { params: { network: string } }) => {
  const { network } = params;

  return <ChainMultisig network={network} />;
};

export default page;
