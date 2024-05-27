import React from 'react';
import Multisig from './Multisig';
import MultisigWalletConnection from './components/MultisigWalletConnection';
import MultisigOwnership from './components/MultisigOwnership';
import MultisigDashboard from './components/MultisigDashboard';

const page = () => {
  return (
    <div className="page">
      {/* <Multisig /> */}
      {/* <MultisigWalletConnection />
      <MultisigOwnership /> */}
      <MultisigDashboard />
    </div>
  );
};

export default page;
