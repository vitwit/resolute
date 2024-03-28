import React from 'react';
import ChainMultiops from './ChainMultiops';
import '../multiops.css';

const page = ({ params }: { params: { network: string } }) => {
  const { network } = params;

  return <ChainMultiops network={network} />;
};

export default page;
