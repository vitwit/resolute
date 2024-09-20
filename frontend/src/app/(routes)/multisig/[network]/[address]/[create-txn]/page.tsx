import React from 'react';
import PageTxnBuilder from './PageTxnBuilder';
import '../../../multisig.css';

const page = ({ params }: { params: { network: string; address: string } }) => {
  return (
    <PageTxnBuilder
      paramChain={params.network.toLowerCase()}
      multisigAddress={params.address}
    />
  );
};

export default page;
