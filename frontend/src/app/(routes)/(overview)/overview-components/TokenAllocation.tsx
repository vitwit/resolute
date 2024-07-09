import React from 'react';
import Image from 'next/image';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { get } from 'lodash';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import TokenAllocationSkeleton from './TokenAllocationSkeleton';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { Tooltip } from '@mui/material';

const truncateChainName = (name: string, maxLength: number) => {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
};

const TokenAllocation = () => {
  const params = useParams();
  const currentChainName = params?.chainNames?.[0];

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const [, , , , totalAmountByChain] = useGetAssetsAmount(chainIDs);

  const balancesLoading = useAppSelector(
    (state) => state.bank.balancesLoading > 0
  );
  const delegationsLoading = useAppSelector(
    (state) => state.staking.delegationsLoading > 0
  );

  const loading = balancesLoading || delegationsLoading;

  const totalAmtObj = totalAmountByChain();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const sumOfTotals: any = Object.values(totalAmtObj).reduce(
    (acc, curr: any) => acc + curr.total,
    0
  );

  for (const key in totalAmtObj) {
    if (totalAmtObj.hasOwnProperty(key)) {
      // Calculate the percentage
      totalAmtObj[key].percentage =
        (totalAmtObj[key].total * 100) / sumOfTotals;
    }
  }

  const entries = Object.entries(totalAmtObj);

  // Sort the array based on the percentage in descending order
  /* eslint-disable @typescript-eslint/no-explicit-any */
  entries.sort((a: any, b: any) => b[1].percentage - a[1].percentage);

  const firstEntries = entries.slice(0, 5);

  // Calculate the "Others" total and percentage
  const others = entries.slice(5);
  // const othersTotal = others.reduce((acc, [key, value]) => acc + value?.total || 0, 0);
  const othersPercentage = others.reduce((acc, [, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      'percentage' in value &&
      typeof value.percentage === 'number'
    ) {
      return acc + value.percentage;
    }
    return acc;
  }, 0); // Convert the sorted array back into an object
  const sortedObj = Object.fromEntries(firstEntries);

  return (
    <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] gap-10">
      <div className="flex flex-col gap-2 w-full">
        <div className="text-h2">Token Allocation</div>
        <div className="secondary-text">Token Allocation </div>
        <div className="divider-line"></div>
      </div>

      {loading ? (
        <TokenAllocationSkeleton />
      ) : (
        <div className="flex gap-10 h-[150px]">
          {Object.entries(sortedObj)
            .slice(0, 5)
            .map(([key, value], index) => (
              <div
                key={index}
                className="flex flex-col rounded-full w-6 h-[150px] justify-end"
              >
                {Number(get(value, 'percentage', 0).toFixed(2)) > 0 ? null : (
                  <div className="text-xs mb-1 text-start">
                    0%
                  </div>
                )}

                <Tooltip title={get(value, 'chainName', key)} placement="top">
                  <div className="mb-2 text-xs">
                    {truncateChainName(get(value, 'chainName', key), 3)}
                  </div>
                </Tooltip>
                <Tooltip
                  title={`${get(value, 'percentage', 0).toFixed(2)}%`}
                  placement="top"
                >
                  <div
                    className="w-6 rounded-[8px_8px_0px_0px]"
                    style={{
                      height: get(value, 'percentage', 0) + '%',
                      background: get(value, 'theme.gradient'),
                      border:
                        get(value, 'chainName', key).toLowerCase() ===
                        currentChainName
                          ? '1px solid'
                          : '',
                    }}
                  ></div>
                </Tooltip>
                <Tooltip
                  title={`${get(value, 'percentage', 0).toFixed(2)}%`}
                  placement="top"
                >
                  <Image
                    className="rounded-full"
                    src={get(value, 'logoUrl', '')}
                    height={24}
                    width={24}
                    alt={`Radio ${index}`}
                  />
                </Tooltip>
              </div>
            ))}

          {/* <div
            key={6}
            className="flex flex-col items-center"
            style={{ height: othersPercentage + '%' }}
          >
            <div className="mb-2 text-xs">{'others'}</div>
            <Tooltip
              title={`${othersPercentage.toFixed(2)}%`}
              placement="bottom-start"
            >
              <div
                className="w-6 rounded-[8px_8px_0px_0px] flex flex-col justify-end"
                style={{
                  background:
                    'linear-gradient(180deg, #ac04d2 0%, #121215 100%)',
                  height: '100%',
                }}
              >
               
                <Image
                  src="/others.svg"
                  height={24}
                  width={24}
                  alt={`Radio ${6}`}
                />
              </div>
            </Tooltip>
          </div> */}

          <div className="flex flex-col rounded-full w-6 h-[150px] justify-end">
            {Number(othersPercentage) > 0 ? null : (
              <div className="text-xs mb-1 text-center">
                0%
              </div>
            )}

            <Tooltip title="Others" placement="top">
              <div className="mb-2 text-xs">Others</div>
            </Tooltip>
            <Tooltip title={`${othersPercentage}%`} placement="top">
              <div
                className="w-6 rounded-[8px_8px_0px_0px]"
                style={{
                  height: othersPercentage + '%',
                  background:
                    'linear-gradient(180deg, #ac04d2 0%, #121215 100%)',
                }}
              ></div>
            </Tooltip>
            <Tooltip title={`${othersPercentage.toFixed(2)}%`} placement="top">
              <Image
                className="rounded-full"
                src="/others.svg"
                height={24}
                width={24}
                alt={`Radio 6`}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenAllocation;
