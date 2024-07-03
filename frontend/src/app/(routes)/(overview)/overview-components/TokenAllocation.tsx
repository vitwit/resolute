import React from 'react';
import Image from 'next/image';

const bars = [
  { gradient: 'linear-gradient(180deg, #c91010 0%, #111113 100%)', height: '50%' },
  { gradient: 'linear-gradient(180deg, #4453df 0%, #111113 100%)', height: '70%' },
  { gradient: 'linear-gradient(180deg, #f1e1d4 0%, #121215 100%)', height: '60%' },
  { gradient: 'linear-gradient(180deg, #ac04d2 0%, #121215 100%)', height: '80%' },
  { gradient: 'linear-gradient(180deg, #4fb573 0%, #0f0f13 100%)', height: '40%' },
  { gradient: 'linear-gradient(180deg, #216c58 0%, #151119 100%)', height: '100%' },
];

const TokenAllocation = () => {
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
        {bars.map((bar, index) => (
          <div key={index} className="flex flex-col items-center" style={{ height: bar.height }}>
            <div className="mb-2 text-xs">{bar.height}</div>
            <div
              className="w-6 rounded-[8px_8px_0px_0px] flex flex-col justify-end items-center"
              style={{ background: bar.gradient, height: '100%' }} 
            >
              {/* Here we have to replace with the "chainLogo's" */}
              <Image
                src=""
                height={24}
                width={24}
                alt={`Radio ${index}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenAllocation;
