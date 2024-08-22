import React from 'react';
import ContractItem from './ContractItem';

const ContractsList = ({ contracts }: { contracts: string[] }) => {
  return (
    <div className="space-y-6">
      {contracts.map((contract) => (
        <ContractItem key={contract} contract={contract} />
      ))}
    </div>
  );
};

export default ContractsList;
