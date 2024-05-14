import Image from 'next/image';
import React, { useState } from 'react';
import DialogAddressesList from '../DialogAddressesList';

const PermissionsData = ({
  permission,
}: {
  permission: InstantiatePermission;
}) => {
  const permissionType = permission.permission;
  const [showAddresses, setShowAddresses] = useState(false);
  const handleDialogOpen = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    value: boolean
  ) => {
    setShowAddresses(value);
    e.stopPropagation();
  };
  return (
    <div>
      {permission.addresses?.length ? (
        <div className="flex gap-1 items-center">
          <div>{permissionType}</div>
          <Image
            onClick={(e) => handleDialogOpen(e, true)}
            className="cursor-pointer"
            src="/view-more-icon.svg"
            height={20}
            width={20}
            alt="View Addresses"
          />
          <DialogAddressesList
            addresses={permission.addresses}
            onClose={() => setShowAddresses(false)}
            open={showAddresses}
          />
        </div>
      ) : (
        <div>{permissionType}</div>
      )}
    </div>
  );
};

export default PermissionsData;
