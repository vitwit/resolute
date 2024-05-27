import React from 'react';
import Multisig from './Multisig';
import MultisigWalletConnection from './components/MultisigWalletConnection';
import MultisigOwnership from './components/MultisigOwnership';

const page = () => {
  return (
    <div className="page">
      {/* <Multisig /> */}
      <MultisigWalletConnection />
      <MultisigOwnership />
    </div>
  );
};

export default page;
