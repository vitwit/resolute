import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import DialogViewDetails from './DialogViewDetails';
import DialogRevokeAll from './DialogRevokeAll';

const FeegrantsByMe = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  const handleViewDetails = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRevokeAll = () => {
    setRevokeDialogOpen(true);
  };

  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
  };

  const grants = [
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

  return (
    <div className="space-y-6 pt-6">
      {grants.map((grant, index) => (
        <div className="garnts-card justify-between w-full" key={index}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Image
                src="/akash.png"
                width={20}
                height={20}
                alt="network-logo"
              />
              <p className="text-b1-light">Akash</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="truncate text-b1">{grant.address}</p>
              <Copy content={grant.address} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-b1-light">Permissions</p>
            <div className="grid grid-cols-4 gap-2 ">
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
            <button className="primary-btn" onClick={handleRevokeAll}>
              Revoke All
            </button>
            <div className="secondary-btn" onClick={handleViewDetails}>
              View Details
            </div>
          </div>
        </div>
      ))}
      <DialogViewDetails open={dialogOpen} onClose={handleCloseDialog} />
      <DialogRevokeAll open={revokeDialogOpen} onClose={handleCloseRevokeDialog} />
    </div>
  );
};

export default FeegrantsByMe;
