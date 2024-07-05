import React from 'react';

const DashboardLoading = () => {
  return (
    <div className="flex pt-10 gap-10">
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
          <div className="flex flex-col items-start gap-2 w-[736px] p-6">
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
                    <tr key={colIndex} className=" animate-pulse  w-[1064px]">
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
        <div className="flex flex-col gap-10 h-[calc(100vh-104px)]">
          <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] h-[302px] gap-10">
            <div className="flex flex-col gap-2 w-full">
              <div className="text-h2">Token Allocation</div>
              <div className="secondary-text">
                Connect your wallet now to access all the modules on{' '}
              </div>
              <div className="divider-line"></div>
            </div>
            <div className="h-[150px] w-[370px] bg-[#252525] rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] h-[486px] gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="text-h2">Governance</div>
              <div className="secondary-text">
                Connect your wallet now to access all the modules on{' '}
              </div>
              <div className="divider-line"></div>
            </div>
            <div className="h-[79px] w-[370px] bg-[#252525] rounded animate-pulse"></div>
            <div className="h-[79px] w-[370px] bg-[#252525] rounded animate-pulse"></div>
            <div className="h-[79px] w-[370px] bg-[#252525] rounded animate-pulse"></div>
            <div className="h-[79px] w-[370px] bg-[#252525] rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
