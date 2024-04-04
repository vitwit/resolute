import React from 'react';
import ChainTxnHistory from './ChainTxnHistory';
import '../history.css';

const page = ({ params }: { params: { network: string } }) => {
  const { network } = params;

  return <ChainTxnHistory network={network} />;
};

export default page;
