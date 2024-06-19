import React from 'react';

const StakingLoading = () => {
  return (
    <div className="flex flex-col items-start gap-20 w-full px-10 py-20">
      <div className="flex flex-col gap-10">
        <div className="space-y-2 items-start w-full">
          <div className="text-h1">Staking</div>
          <div className="secondary-text">
            Here&apos;s an overview of your staked assets, including delegation and
            undelegation details, and your total staked balance.
          </div>
          <div className="horizontal-line"></div>
        </div>

        {/* Staking Summary */}
        <div className="flex gap-6 w-full px-6 py-0">
          <div className="grid grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="w-[254px] animate-pulse h-[128px] bg-[#252525] rounded"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Unbonding */}
      <div className="flex flex-col gap-10">
        <div className="space-y-2 items-start">
          <div className="text-h2">Unbonding</div>
          <div className="secondary-text">
            Unbonding delegations will be locked until their locked time, after
            which they will be available in your balance.
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="grid grid-cols-3 gap-10 px-6 py-0">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="w-[328px] h-[175px] animate-pulse bg-[#252525] rounded"
            />
          ))}
        </div>
      </div>
      {/* Delegations */}
      <div className="flex flex-col gap-10 w-full">
        <div className="space-y-2 items-start">
          <div className="text-h2">Delegations</div>
          <div className="secondary-text">
            Connect your wallet now to access all the modules on resolute
          </div>
          <div className="horizontal-line"></div>
        </div>
        {[1, 2].map((row, index) => (
          <div key={index} className="px-6 py-0">
            <div className="flex justify-between w-full mb-4">
              <div className="flex space-x-4">
                <div className="space-x-2 flex justify-center items-center">
                  <div className="w-10 h-10 rounded-full bg-[#252525]" />
                  <div className="h-8 w-32 rounded bg-[#252525] animate-pulse" />
                  <div className="h-8 w-32 rounded-full bg-[#252525] animate-pulse" />
                </div>
              </div>
            </div>
            {[1, 2, 3].map((val, id) => (
              <div
                key={id}
                className="h-20 my-4 w-full rounded bg-[#252525] animate-pulse"
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Validator table */}
      <div className="w-full gap-10 flex flex-col">
        <div className="space-y-2 w-full">
          <div className="text-h2">Validator</div>
          <div className="divider-line"></div>
        </div>
        <div className="flex flex-col items-start gap-2 w-full p-6">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                {[
                  'Rank',
                  'Validator',
                  'Commission',
                  'Voting Power',
                  'Status',
                  '',
                ].map((header, hIndex) => (
                  <th key={hIndex} className="w-1/5">
                    <div className="secondary-text items-start flex">
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(3)
                .fill(null)
                .map((_, colIndex) => (
                  <tr key={colIndex} className=" animate-pulse  w-full">
                    {Array(6)
                      .fill(null)
                      .map((_, colIndex) => (
                        <td key={colIndex}>
                          <div className="h-10 bg-[#252525]  rounded my-6 mx-1"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StakingLoading;
