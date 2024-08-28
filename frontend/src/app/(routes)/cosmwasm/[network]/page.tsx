import React from 'react';
import '../cosmwasm.css';
import ChainContracts from './ChainContracts';

const page = ({ params: { network } }: { params: { network: string } }) => {
  return <ChainContracts network={network} />;
};

export default page;
