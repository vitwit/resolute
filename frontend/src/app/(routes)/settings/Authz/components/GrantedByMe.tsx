import React, { useState } from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import DialogAuthzDetails from './DialogAuthzDetails';
import DialogRevokeAll from '../../components/DialogRevokeAll';
import DialogConfirmDelete from '@/app/(routes)/multisig/components/multisig-account/DialogConfirmDelete';

interface Grant {
  address: string;
  permissions: string[];
}

const GrantedByMe = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);

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

  const handleDeletePermission = (permission: string) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPermission(null);
  };

  const handleDelete = () => {
    console.log('Delete permission:', selectedPermission);
    // Implement your delete logic here
    setDeleteDialogOpen(false);
  };

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

  return (
    <div className="space-y-6 pt-6">
      {grants.map((grant, index) => (
        <div className="grants-card justify-between gap-16 w-full" key={index}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Image
                src="/akash.png"
                width={20}
                height={20}
                alt="network-logo"
              />
              <p className="text-b1-light capitalize">Akash</p>
            </div>
            <div className="flex gap-2 items-center h-8">
              <p className="truncate text-b1">{grant.address}</p>
              <Copy content={grant.address} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-b1-light">Permissions</p>
            <div className="grid grid-cols-4 gap-2 ">
              {grant.permissions.map((permission, idx) => (
                <div className="permission-card" key={idx}>
                  <div className="flex space-x-2 items-center">
                    <p className="text-b1">{permission}</p>
                    <Image
                      src="/delete.svg"
                      width={16}
                      height={16}
                      alt="delete-icon"
                      onClick={() => handleDeletePermission(permission)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-6 items-end">
            <button className="primary-btn" onClick={handleRevokeAll}>
              Revoke
            </button>
            <div className="secondary-btn" onClick={handleViewDetails}>
              View Details
            </div>
          </div>
        </div>
      ))}
      <DialogAuthzDetails open={dialogOpen} onClose={handleCloseDialog} />
      <DialogRevokeAll
        open={revokeDialogOpen}
        onClose={handleCloseRevokeDialog}
      />
      <DialogConfirmDelete
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the permission "${selectedPermission}"?`}
        loading={false}
      />
    </div>
  );
};

export default GrantedByMe;
