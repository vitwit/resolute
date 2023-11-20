import { useAppSelector } from '@/custom-hooks/StateHooks';
import useSortedAssets from '@/custom-hooks/useSortedAssets';
import { displayAmount, displayAmountWithDenom } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
import { displayAmountInDollars } from '../../../../utils/util';

const AssetsTable = () => {
  const [sortedAssets] = useSortedAssets();
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
                  <th className="w-1/5">Chains</th>
                  <th className="w-1/5">Staked</th>
                  <th className="w-1/4">Rewards</th>
                  <th className="w-1/4">Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map((asset) => (
                  <tr key={asset.chainID + asset.denom}>
                    <td>
                      <div>
                        {displayAmountWithDenom(
                          asset.balance,
                          asset.displayDenom
                        )}
                      </div>
                      <div className="text-xs text-[#a7a2b5] font-thin leading-[normal]">
                        on {asset.chainName}
                      </div>
                    </td>
                    <td>
                      {asset.type === 'native'
                        ? displayAmountWithDenom(
                            asset.staked,
                            asset.displayDenom
                          )
                        : '-'}
                    </td>
                    <td>
                      {asset.type === 'native'
                        ? displayAmountWithDenom(
                            asset.rewards,
                            asset.displayDenom
                          )
                        : '-'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <div>{displayAmountInDollars(asset.usdPrice)}</div>
                        <div className="flex">
                          <Image
                            src="/down-arrow-filled-icon.svg"
                            height={16}
                            width={16}
                            alt="decreased"
                          />
                          <div className="text-[#E57575]">
                            {displayAmount(asset.inflation)}
                          </div>
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
      ) : (
        <div
          style={{marginTop:100}}
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
