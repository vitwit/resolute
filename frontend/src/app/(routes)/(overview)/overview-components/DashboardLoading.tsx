import React from 'react';

const DashboardLoading = () => {
  return (
    <div className="flex gap-10">
      <div className="flex flex-1">
        <div className="flex-col w-full">
          {/* <div className="flex flex-col items-center gap-10 mb-20">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex space-x-2">
            <div className="text-h1 italic space-x-4">Hello</div>
            <div className="h-[42px] w-[270px] bg-[#252525] rounded animate-pulse"></div>
          </div>
          <div className="secondary-text">
            Summary of your assets across all chains
          </div>
          <div className="divider-line"></div>
        </div>

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
      </div> */}

          {/* <AssetsTable chainIDs={chainIDs} /> Skeleton*/}
          <div className="flex flex-col items-start gap-2 w-[690px] p-6">
            <table className="relative w-full">
              <thead className="w-full">
                <tr>
                  {['Available', 'Staked', 'Rewards', 'Total', 'Actions'].map(
                    (header, hIndex) => (
                      <th key={hIndex} className="w-1/4">
                        <div className="secondary-text items-start flex">
                          {header}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {Array(3)
                  .fill(null)
                  .map((_, colIndex) => (
                    <tr key={colIndex} className=" animate-pulse">
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
    </div>
  );
};

export default DashboardLoading;
