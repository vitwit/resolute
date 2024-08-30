import React from 'react';
import AddressInputField from './AddressInputField';
import Image from 'next/image';
import { ADD_ICON_ROUNDED } from '@/constants/image-names';

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
            disableDelete={addresses.length === 1}
          />
        </div>
      ))}
      <div className="flex justify-center">
        <button
          className="flex items-center gap-2"
          type="button"
          onClick={() => onAddAddress('')}
        >
          <Image src={ADD_ICON_ROUNDED} width={20} height={20} alt="" />{' '}
          <div className="text-[12px]">Add More</div>
        </button>
      </div>
    </div>
  );
};

export default AddAddresses;
