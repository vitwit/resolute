import React, { useState } from 'react';
import Image from 'next/image';
import DialogConfirmDelete from '../../multisig/components/multisig-account/DialogConfirmDelete';

interface Network {
  name: string;
  networkId: string;
  logo: string;
}

const networks: Network[] = [
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

const CustomNetworkCard: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

  const handleOpenDialog = (network: Network) => {
    setSelectedNetwork(network);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNetwork(null);
  };

  const handleDelete = () => {
    if (selectedNetwork) {
      // Perform delete action here, e.g., remove from state or make an API call
      console.log(`Deleting network: ${selectedNetwork.name}`);
    }
    handleCloseDialog();
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-10 px-6">
        {networks.map((network, Id) => (
          <div className="customnetwork-card" key={Id}>
            <div className="flex justify-between w-full">
              <div className="flex gap-1 items-center">
                <Image
                  src={network.logo}
                  width={24}
                  height={24}
                  alt={`${network.name} logo`}
                  className="w-6 h-6"
                />
                <p className="text-b1">{network.name}</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => handleOpenDialog(network)}
              >
                Delete
              </button>
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

      {selectedNetwork && (
        <DialogConfirmDelete
          open={openDialog}
          onClose={handleCloseDialog}
          onDelete={handleDelete}
          title={`Delete ${selectedNetwork.name}`}
          description={`Are you sure you want to delete the ${selectedNetwork.name} network?`}
          loading={false}
        />
      )}
    </div>
  );
};

export default CustomNetworkCard;
