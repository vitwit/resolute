import React from 'react';
import AddressInputField from './AddressInputField';

interface AddAddressesI {
  addresses: string[];
  setAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddAddresses = (props: AddAddressesI) => {
  const { addresses, setAddresses } = props;

  const onAddAddress = (address: string) => {
    setAddresses((prev) => [...prev, address]);
  };

  const onDelete = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const input = e.target.value;
    const newAddresses = addresses.map((value, key) => {
      if (index === key) {
       return input.trim();
      }
      return value;
    });
    setAddresses(newAddresses);
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
