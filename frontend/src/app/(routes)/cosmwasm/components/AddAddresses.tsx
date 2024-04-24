import React from 'react';
import AddressInputField from './AddressInputField';

interface AddAddressesI {
  addresses: string[];
  setAddresess: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddAddresses = (props: AddAddressesI) => {
  const { addresses, setAddresess } = props;

  const onAddAddress = (address: string) => {
    setAddresess((prev) => [...prev, address]);
  };

  const onDelete = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresess(newAddresses);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const input = e.target.value;
    const newAddresses = addresses.map((value, key) => {
      if (index === key) {
        value = input.trim();
      }
      return value;
    });
    setAddresess(newAddresses);
  };

  return (
    <div className="space-y-6">
      {addresses.map((value, index) => (
        <div key={index}>
          <AddressInputField
            address={value}
            index={index}
            onDelete={onDelete}
            handleChange={handleAddressChange}
          />
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          className="primary-gradient add-address-btn"
          onClick={() => onAddAddress('')}
        >
          Add More
        </button>
      </div>
    </div>
  );
};

export default AddAddresses;
