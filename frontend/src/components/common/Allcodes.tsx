import React from 'react';
import PageHeader from './PageHeader';
import Copy from './Copy';
import Image from 'next/image';

const codesData = [
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Everybody',
    imageUrl: '/akash1.png',
  },
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Any of the addresses',
    imageUrl: '/akash1.png',
  },
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Any of the addresses',
    imageUrl: '/akash1.png',
  },
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Everybody',
    imageUrl: '/akash1.png',
  },
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Any of the addresses',
    imageUrl: '/akash1.png',
  },
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Everybody',
    imageUrl: '/akash1.png',
  },
  {
    codeId: 1,
    codeHash: '8EC0B9BA0419C682695E74C16...',
    creator: 'osmo1jxdhf...evqfkm29me0pnht',
    permission: 'Any of the addresses',
    imageUrl: '/akash1.png',
  },
];

const AllCodes = () => {
  return (
    <div className="flex flex-col gap-10 py-10">
      <AllCodesHeader />
      <div className="flex flex-col gap-6 w-full px-6">
        {codesData.map((code, index) => (
          <div key={index} className="contract-card">
            <div className="flex flex-col gap-2 w-[10%]">
              <p className="secondary-text">Code ID</p>
              <p className="text-b1">{code.codeId}</p>
            </div>
            <div className="flex flex-col gap-2 w-[30%]">
              <p className="secondary-text">Code Hash</p>
              <div className="flex">
                <p className="text-b1 underline">{code.codeHash}</p>
                <Copy content={code.codeHash} />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[30%]">
              <p className="secondary-text">Creator</p>
              <div className="flex items-center gap-1">
                <Image
                  src={code.imageUrl}
                  width={16}
                  height={16}
                  alt="network-logo"
                  className="w-4 h-4"
                />
                <p className="text-b1">{code.creator}</p>
                <Copy content={code.creator} />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[20%]">
              <p className="secondary-text">Permission</p>
              <p
                className={`text-b1 ${code.permission === 'Any of the addresses' ? 'underline' : ''}`}
              >
                {code.permission}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCodes;

const AllCodesHeader = () => {
  return (
    <PageHeader
      title="All Codes"
      description="All the proposals in governance require community voting for approval or rejection"
    />
  );
};
