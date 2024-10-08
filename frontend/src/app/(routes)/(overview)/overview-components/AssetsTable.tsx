import { useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React from 'react';
import Asset from './Asset';
import NoAssets from '@/components/illustrations/NoAssets';
import DashboardLoading from './DashboardLoading';

const AssetsTable = ({ chainIDs }: { chainIDs: string[] }) => {
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const [sortedAssets, authzSortedAssets] = useSortedAssets(chainIDs, {
    showAvailable: true,
    showRewards: true,
    showStaked: true,
  });

  const assets = isAuthzMode ? authzSortedAssets : sortedAssets;

  const balancesLoading = useAppSelector(
    (state) => state.bank.balancesLoading > 0
  );
  const delegationsLoading = useAppSelector(
    (state) => state.staking.delegationsLoading > 0
  );
  const authzBalanceLoading = useAppSelector(
    (state) => state.bank.authz.balancesLoading > 0
  );
  const authzDelegationsLoading = useAppSelector(
    (state) => state.staking.authz.delegationsLoading > 0
  );

  const loading = !isAuthzMode && (balancesLoading || delegationsLoading);
  const authzLoading =
    isAuthzMode && (authzBalanceLoading || authzDelegationsLoading);

  return (
    <div className="flex flex-col gap-6 w-full bg-[#ffffff05] rounded-2xl p-6">
      <div className=" flex flex-col gap-1">
        <div className="text-h2 !font-bold">Asset Information</div>
        <div className="flex flex-col gap-2">
          <div className="secondary-text">
            Information of your asset holdings
          </div>
          <div className="divider-line"></div>
        </div>
      </div>

      {/* table */}

      {assets.length ? (
        <div className="flex flex-col items-start gap-2 w-full flex-1">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                {['Available', 'Staked', 'Rewards', 'Value', ''].map(
                  (header, hIndex) => (
                    <th key={hIndex} className="">
                      <div className="secondary-text items-start flex px-4">
                        {header}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <Asset
                  asset={asset}
                  key={asset.chainID + asset.denom}
                  // showChainName={chainIDs.length > 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full flex flex-col flex-1 items-center justify-start text-[#fffffff0]">
          {loading || authzLoading ? <DashboardLoading /> : <NoAssets />}
        </div>
      )}
    </div>
  );
};

export default AssetsTable;
