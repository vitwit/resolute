import { useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React from 'react';
import Asset from './Asset';
import { CircularProgress } from '@mui/material';
import NoAssets from '@/components/illustrations/NoAssets';
import Image from 'next/image';

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
    <div className="flex flex-col gap-10 self-stretch overflow-scroll h-[50vh]">
      <div className="space-y-1">
        <div className="text-white text-lg not-italic font-normal leading-[27px]">
          Asset Information
        </div>
        <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-[21px]">
          Connect your wallet now to access all the modules on resolute
        </div>
        <div className="horizontal-line"></div>
      </div>

      {/* table */}

      {assets.length ? (
        <div className="flex text-black flex-col items-start gap-2 self-stretch p-6">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                {['Available', 'Staked', 'Rewards', 'Price', 'Value', 'Actions'].map((header) => (
                  <th className="w-1/6">
                    <div className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
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
          {loading || authzLoading ? (
            <CircularProgress size={32} />
          ) : (
            <NoAssets />
          )}
        </div>
      )}
    </div>
  );
};

export default AssetsTable;
