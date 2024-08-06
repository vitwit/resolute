import React from 'react';
import Image from 'next/image';

const networks = [
  {
    name: 'Akash',
    networkId: '12HFJD738465869',
    logo: '/akash1.png',
  },
  {
    name: 'Cosmos',
    networkId: '39SJD843058393',
    logo: '/akash1.png',
  },
  {
    name: 'Osmosis',
    networkId: '93KDJS834753947',
    logo: '/akash1.png',
  },
];

const CustomNetworkCard = () => {
  return (
    <div className="grid grid-cols-3 gap-10 px-6">
      {networks.map((network, Id) => (
        <div className="customnetwork-card" key={Id}>
          <div className="flex justify-between w-full">
            <div className="flex gap-1 items-center">
              <Image
                src={network.logo}
                width={24}
                height={24}
                alt="network-logo"
                className="w-6 h-6"
              />
              <p className="text-b1">Custom Network</p>
            </div>

            <button className="primary-btn">Delete</button>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-small-light">Network</p>
              <p className="text-b1">{network.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-small-light">Network ID</p>
              <p className="text-b1">{network.networkId}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomNetworkCard;
