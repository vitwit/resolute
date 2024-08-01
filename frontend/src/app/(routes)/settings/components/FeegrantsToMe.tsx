import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';

type Grant = {
  address: string;
  permissions: string[];
};

const FeegrantsToMe = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  const grants: Grant[] = [
    {
      address: 'pasg1y0hvu8ts6m87yltguyufwf',
      permissions: ['send', 'Delegate', 'vote', 'send'],
    },
    {
      address: 'pasg1xy2a8ts6m87yltguyufwf',
      permissions: ['send', 'Delegate', 'vote', 'send'],
    },
    {
      address: 'pasg1y0hvu8ts6m87yltguyufwf',
      permissions: [
        'send',
        'Delegate',
        'vote',
        'send',
        'send',
        'Delegate',
        'vote',
        'send',
      ],
    },
    {
      address: 'pasg1xy2a8ts6m87yltguyufwf',
      permissions: ['send', 'Delegate', 'vote', 'send'],
    },
  ];

  const handleSelectCard = (index: number) => {
    setSelectedCardIndex(selectedCardIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 pt-6">
      {grants.map((grant, index) => (
        <div
          className={`garnts-card justify-between w-full ${
            selectedCardIndex === index ? 'selected-grants-card' : ''
          }`}
          key={index}
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p className="text-b1-light">Address</p>
              {selectedCardIndex === index && (
                <div className="flex space-x-0">
                  <Image
                    src="/tick-icon.svg"
                    width={16}
                    height={16}
                    alt="used-icon"
                  />
                  <span className="text-[#2BA472]">Currently Using</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <p className="truncate text-b1">{grant.address}</p>
              <Copy content={grant.address} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-b1-light">Permissions</p>
            <div className="grid grid-cols-4 gap-2">
              {grant.permissions.map((permission, idx) => (
                <div
                  className="permission-card flex gap-2 items-center"
                  key={idx}
                >
                  <p className="text-b1">{permission}</p>
                  <Image
                    src="/akash.png"
                    width={20}
                    height={20}
                    alt="network-logo"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-6 items-end">
            <button
              className={
                selectedCardIndex === index ? 'cancel-btn' : 'primary-btn'
              }
              onClick={() => handleSelectCard(index)}
            >
              {selectedCardIndex === index ? 'Cancel' : 'Using'}
            </button>
            <div className="secondary-btn">view details</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeegrantsToMe;
