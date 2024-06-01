import React from 'react';
import '../../multisig.css';
import PageMultisigInfo from '../../components/multisig-account/PageMultisigInfo';

const page = ({ params }: { params: { network: string; address: string } }) => {
  return (
    <div>
      <PageMultisigInfo
        paramChain={params.network}
        paramAddress={params.address}
      />
    </div>
  );
};

export default page;
