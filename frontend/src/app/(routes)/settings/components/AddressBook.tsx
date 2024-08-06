import React, { useState } from 'react';
import Image from 'next/image';
import DialogConfirmDelete from '../../multisig/components/multisig-account/DialogConfirmDelete';
import DialogAddAddress from '../components/DialogAddAddress';

interface Address {
  name: string;
  address: string;
}

const addresses: Address[] = [
  {
    name: 'Pavani',
    address: 'pasg1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltguyufwf',
  },
  {
    name: 'Alex',
    address: 'pasg1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltguyufwg',
  },
  {
    name: 'Sam',
    address: 'pasg1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltguyufwh',
  },
];

const AddressBook: React.FC = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteClick = (address: string) => {
    setSelectedAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAddress(null);
  };

  const handleDelete = async () => {
    if (selectedAddress) {
      setLoading(true);

      setTimeout(() => {
        console.log(`Address deleted: ${selectedAddress}`);
        setLoading(false);
        handleCloseDeleteDialog();
      }, 1000);
    }
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <div className="pt-10 px-6">
      <AddressBookHeader onAddClick={handleOpenAddDialog} />
      <table className="min-w-full mt-6">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-b1-light">Name</th>
            <th className="px-6 py-3 text-left text-b1-light">Address</th>
            <th className="px-6 py-3 text-left justify-end items-end"></th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((entry, index) => (
            <tr key={index}>
              <td className="px-6 py-2 flex items-center gap-2">
                <Image src="/avatar.svg" width={24} height={24} alt="Avatar" />
                <span className="text-b1">{entry.name}</span>
              </td>
              <td className="px-6 py-4 text-b1">{entry.address}</td>
              <td className="px-6 py-4 flex items-end justify-end">
                <button onClick={() => handleDeleteClick(entry.address)}>
                  <Image
                    src="/delete.svg"
                    width={24}
                    height={24}
                    alt="Delete Icon"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DialogConfirmDelete
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the address ${selectedAddress}?`}
        loading={loading}
      />
      <DialogAddAddress
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
      />
    </div>
  );
};


              // Address book header //

const AddressBookHeader: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => {
  return (
    <div className="flex items-end gap-6">
      <div className="flex gap-1 flex-col w-full">
        <div className="text-h2">Address Book</div>
        <div className="flex flex-col gap-2">
          <div className="text-b1-light">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="divider-line"></div>
        </div>
      </div>
      <div>
        <button className="primary-btn !w-[120px]" onClick={onAddClick}>
          Add Address
        </button>
      </div>
    </div>
  );
};

export default AddressBook;
