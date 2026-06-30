import React from 'react';

const ValidatorTableLoading = () => {
  return (
    <div className="w-full flex flex-col">
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
                <tr key={colIndex} className="animate-pulse  w-full">
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
  );
};

export default ValidatorTableLoading;
