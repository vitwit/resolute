import React from 'react';
import ChainMultiops from './ChainMultiops';
import '../multiops.css';

const page = ({ params: { network } }: { params: { network: string } }) => {
  return <ChainMultiops network={network} />;
};

export default page;
