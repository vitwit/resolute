import React from 'react';
import ContractItem from './ContractItem';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const ContractsList = ({
  contracts,
  chainID,
}: {
  contracts: string[];
  chainID: string;
}) => {
  const { getChainInfo } = useGetChainInfo();
  const { chainLogo } = getChainInfo(chainID);
  return (
    <div className="px-6 flex flex-col">
      {contracts.map((contract) => (
        <div key={contract}>
          <div className="py-6">
            <ContractItem contract={contract} chainLogo={chainLogo} />
          </div>
          <div className="divider-line"></div>
        </div>
      ))}
    </div>
  );
};

export default ContractsList;
