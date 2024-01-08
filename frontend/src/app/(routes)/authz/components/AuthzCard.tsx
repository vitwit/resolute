import React from 'react';
import Image from 'next/image';

const cardData = [
  {
    logoSrc: '/desmos-logo.png',
    granter: 'Desmos',
    grantAddress: 'Cosmos1lqggps6jjms0l8uqktqh45w',
    permission: ['Send', 'Receive']
  },
];

const AuthzCard = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {cardData.map((card, index) => (
        <div className="authz-card" key={index}>
          <div className="flex space-x-2 items-center">
            <Image
              className="w-[32px] h-[32px] rounded-full"
              src={card.logoSrc}
              width={32}
              height={32}
              alt="Network-Logo"
            />
            <p>{card.granter}</p>
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-normal leading-[normal]">
            Granter
          </div>
          <div className="grant-address">
            <p>{card.grantAddress}</p>
            <Image
              src="/copy.svg"
              width={24}
              height={24}
              alt="copy"
              draggable={false}
            />
          </div>
          <div className="">Permission</div>
          <div className="grant-address">
            <p>{card.permission}</p>
            <Image
              src="/close-icon.svg"
              width={12}
              height={12}
              alt="close-icon"
              draggable={false}
            />
          </div>
          <div>
            <button className='create-grant-btn'>View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthzCard;
