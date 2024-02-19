import { ValidatorProfileInfo } from '@/types/staking';
import React from 'react';
import ValidatorItem from './ValidatorItem';
import TableHeader from './TableHeader';

const ValidatorsTable = ({
  data,
}: {
  data: Record<string, ValidatorProfileInfo>;
}) => {
  const columnTitles = [
    'Network Name',
    'Validator Rank',
    'Voting Power',
    'Total Delegators',
    'Commission',
    'Total Staked Assets',
    'Actions',
  ];
  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="validators-table bg-[#1a1a1b] px-8 py-8">
        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <table className="w-full text-sm leading-normal">
              <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
                <tr className="text-left">
                  {columnTitles.map((title) => (
                    <TableHeader key={title} title={title} />
                  ))}
                </tr>
              </thead>
              <tbody className="flex-1">
                {Object.keys(data).map((chainID) => {
                  return (
                    <ValidatorItem
                      validatorInfo={data[chainID]}
                      key={chainID}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;
