import React from 'react';
import PageTxnBuilder from './PageTxnBuilder';
import '../../../multisig.css';

const page = ({ params }: { params: { network: string; address: string } }) => {
  return (
    <div>
      <PageTxnBuilder
        paramChain={params.network.toLowerCase()}
        multisigAddress={params.address}
      />
    </div>
  );
};

export default page;
