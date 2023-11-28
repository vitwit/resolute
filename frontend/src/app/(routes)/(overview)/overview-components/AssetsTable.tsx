import { useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React from 'react';
import Asset from './Asset';

const AssetsTable = ({ chainIDs }: { chainIDs: string[] }) => {
  const [sortedAssets] = useSortedAssets(chainIDs);
  const balancesLoading = useAppSelector(
    (state) => state.bank.balancesLoading > 0
  );
  const delegationsLoading = useAppSelector(
    (state) => state.staking.delegationsLoading > 0
  );

  return (
    <>
      {sortedAssets.length ? (
        <div className="assets-table bg-[#0E0b26] px-6 py-4 space-y-6">
          <div className="text-white text-xl font-medium leading-[normal];">
            Asset Information
          </div>
          <div>
            <table className="w-full text-sm leading-normal">
              <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
                <tr className="text-left">
                  <th className="w-1/5">Available</th>
                  <th className="w-1/5">Staked</th>
                  <th className="w-1/4">Rewards</th>
                  <th className="w-1/4">Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map((asset) => (
                  <Asset
                    asset={asset}
                    key={asset.chainID + asset.denom}
                    showChainName={chainIDs.length > 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          style={{ marginTop: 100 }}
          className="w-full flex items-center justify-center text-white"
        >
          {balancesLoading || delegationsLoading ? (
            <>Loading...</>
          ) : (
            <>- No data -</>
          )}
        </div>
      )}
    </>
  );
};

export default AssetsTable;
