import React from 'react';

const ValidatorsTable = () => {
  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="validators-table bg-[#1a1a1b] px-8 py-8">
        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <table className="w-full text-sm leading-normal">
              <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
                <tr className="text-left">
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Network Name
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Validator Rank
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Voting Power
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Total Delegators
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Gov. Participation
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Commission
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Total Staked Assets
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;
