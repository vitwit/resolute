import React from 'react';
import '../transfers.css';
import Transfers from './Transfers';

const page = ({ params }: { params: { chainName: string } }) => {
  const { chainName } = params;

  return <Transfers chainName={chainName} />;
};

export default page;
