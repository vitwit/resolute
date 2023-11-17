import Image from 'next/image';
import React from 'react';

const AssetsTable = () => {
  return (
    <div className="assets-table bg-[#0E0b26] px-6 py-4 space-y-6">
      <div className="flex justify-between">
        <div className="text-white text-xl font-medium leading-[normal];">
          Asset Information
        </div>
        <div>
          <Image
            src="/graph-view-icon.svg"
            height={32}
            width={32}
            alt="graph-view"
          />
        </div>
      </div>
      <div>
        <table className="w-full text-sm leading-normal">
          <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
            <tr className="text-left">
              <th className="w-1/5">Chains</th>
              <th className="w-1/5">Staked</th>
              <th className="w-1/4">Rewards</th>
              <th className="w-1/4">Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <tr key={index}>
                <td>
                  <div>1.234 OSMO</div>
                  <div className="text-xs text-[#a7a2b5] font-thin leading-[normal]">
                    on Osmosis
                  </div>
                </td>
                <td>1.234 OSMO</td>
                <td>1.234 OSMO</td>
                <td>
                  <div className="flex gap-2">
                    <div>$ 1.47</div>
                    <div className="flex">
                      <Image
                        src="/down-arrow-filled-icon.svg"
                        height={16}
                        width={16}
                        alt="decreased"
                      />
                      <div className="text-[#E57575]">2.3 %</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex justify-between">
                    <div className="asset-action">
                      <Image
                        src="/claim-icon.svg"
                        height={16}
                        width={16}
                        alt="Claim"
                      />
                    </div>
                    <div className="asset-action">
                      <Image
                        src="/claim-stake-icon.svg"
                        height={16}
                        width={16}
                        alt="Claim and Stake"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetsTable;
