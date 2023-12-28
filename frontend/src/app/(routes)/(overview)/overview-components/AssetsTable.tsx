import { useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React from 'react';
import Asset from './Asset';
import { CircularProgress } from '@mui/material';
import NoAssets from '@/components/illustrations/NoAssets';

const AssetsTable = ({ chainIDs }: { chainIDs: string[] }) => {
  const [sortedAssets] = useSortedAssets(chainIDs, {
    showAvailable: true,
    showRewards: true,
    showStaked: true,
  });
  const balancesLoading = useAppSelector(
    (state) => state.bank.balancesLoading > 0
  );
  const delegationsLoading = useAppSelector(
    (state) => state.staking.delegationsLoading > 0
  );

  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="assets-table bg-[#1a1a1b] px-8 py-8">
        <div className="flex flex-col flex-1">
          {sortedAssets.length ? (
            <div className="flex-1">
              <table className="w-full text-sm leading-normal">
                <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
                  <tr className="text-left">
                    <th className="w-1/5">
                      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                        Available
                      </div>
                    </th>
                    <th className="w-1/5">
                      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                        Staked
                      </div>
                    </th>
                    <th className="w-1/5">
                      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                        Rewards
                      </div>
                    </th>
                    <th className="w-1/5">
                      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                        Price
                      </div>
                    </th>
                    <th className="w-1/5">
                      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                        Value
                      </div>
                    </th>
                    <th className="max-h-[104px]">
                      <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="flex-1">
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
          ) : (
            <div className="w-full flex flex-col flex-1 items-center justify-center text-white">
              {balancesLoading || delegationsLoading ? (
                <CircularProgress size={32} />
              ) : (
                <NoAssets />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsTable;
