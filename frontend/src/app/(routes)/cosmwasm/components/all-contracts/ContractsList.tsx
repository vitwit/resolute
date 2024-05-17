import React from 'react';
import TableHeader from './TableHeader';
import ContractItem from './ContractItem';

const ContractsList = ({ contracts }: { contracts: string[] }) => {
  const tableColumnTitles = ['Contracts', 'Action'];
  return (
    <div className="codes-table">
      <table className="w-full text-sm leading-normal">
        <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
          <tr className="text-left">
            {tableColumnTitles.map((title) => (
              <TableHeader key={title} title={title} />
            ))}
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <ContractItem key={contract} contract={contract} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsList;
