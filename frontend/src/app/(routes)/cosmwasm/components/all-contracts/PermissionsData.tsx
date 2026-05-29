import React, { useState } from 'react';
import DialogAddressesList from './DialogAddressesList';

const PermissionsData = ({
  permission,
}: {
  permission: InstantiatePermission;
}) => {
  const permissionType = permission.permission;
  const [showAddresses, setShowAddresses] = useState(false);
  const handleDialogOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: boolean
  ) => {
    setShowAddresses(value);
    e.stopPropagation();
  };
  return (
    <div>
      <div className="flex flex-col gap-2 w-[20%]">
        <p className="secondary-text">Permission</p>
        <button
          onClick={(e) => {
            if (permission.addresses?.length) handleDialogOpen(e, true);
          }}
          className={`text-b1 ${permissionType === 'AnyOfAddresses' ? 'underline' : ''}`}
        >
          {permissionType}
        </button>
      </div>
      <DialogAddressesList
        addresses={permission.addresses}
        onClose={() => setShowAddresses(false)}
        open={showAddresses}
      />
    </div>
  );
};

export default PermissionsData;
