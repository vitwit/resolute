import React from 'react';
import Image from 'next/image';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { get } from 'lodash';

const TokenAllocation = ({ chainIDs }: { chainIDs: string[] }) => {
  const [, , , , totalAmountByChain] = useGetAssetsAmount(chainIDs);

  const totalAmtObj = totalAmountByChain()

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const sumOfTotals: any = Object.values(totalAmtObj).reduce((acc, curr: any) => acc + curr.total, 0);

  for (let key in totalAmtObj) {
    if (totalAmtObj.hasOwnProperty(key)) {
      // Calculate the percentage
      totalAmtObj[key].percentage = totalAmtObj[key].total * 100 / sumOfTotals;
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
    if (value && typeof value === 'object' && 'percentage' in value && typeof value.percentage === 'number') {
      return acc + value.percentage;
    }
    return acc;
  }, 0);  // Convert the sorted array back into an object
  const sortedObj = Object.fromEntries(firstEntries);

  console.log(sortedObj);



  return (
    <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] gap-10">
      <div className="flex flex-col gap-2 w-full">
        <div className="text-h2">Token Allocation</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on{' '}
        </div>
        <div className="divider-line"></div>
      </div>
      <div className="flex items-end justify-between h-[150px]">
        {Object.entries(sortedObj).slice(0, 5).map(([key, value], index) => (

          <div key={index} className="flex flex-col items-center" style={{ height: get(value, 'percentage', 0) + '%' }}>
            <div className="mb-6 text-xs">{get(value, 'chainName', key)}</div>
            <div
              className="w-6 rounded-[8px_8px_0px_0px] flex flex-col justify-end items-center"
              style={{ background: get(value, 'theme.gradient'), height: '100%' }}
            >
              {/* Here we have to replace with the "chainLogo's" */}
              <Image
               className='mt-20'
                src={get(value, 'logoUrl', '')}
                height={24}
                width={24}
                alt={`Radio ${index}`}
              />
            </div>
          </div>
        ))}

        <div key={6} className="flex flex-col items-center" style={{ height: othersPercentage + '%' }}>
          <div className="mb-2 text-xs">{'others'}</div>
          <div
            className="w-6 rounded-[8px_8px_0px_0px] flex flex-col justify-end items-center"
            style={{ background: 'linear-gradient(180deg, #ac04d2 0%, #121215 100%)', height: '100%' }}
          >
            {/* Here we have to replace with the "chainLogo's" */}
            <Image
              src={''}
              height={24}
              width={24}
              alt={`Radio ${6}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenAllocation;
