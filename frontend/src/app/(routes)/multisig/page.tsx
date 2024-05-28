import React from 'react';
import Multisig from './Multisig';
import MultisigWalletConnection from './components/MultisigWalletConnection';
import MultisigOwnership from './components/MultisigOwnership';
import MultisigDashboard from './components/MultisigDashboard';
import SingleMultisig from './components/SingleMultisig';

const page = () => {
  return (
    <div className="page">
      <Multisig />
    </div>
  );
};

export default page;
