import React from 'react';
import MultisigAccount from './MultisigAccount';
import '../../multisig.css';

const page = ({ params }: { params: { network: string; address: string } }) => {
  return (
    <div>
      <MultisigAccount
        paramChain={params.network}
        paramAddress={params.address}
      />
    </div>
  );
};

export default page;
