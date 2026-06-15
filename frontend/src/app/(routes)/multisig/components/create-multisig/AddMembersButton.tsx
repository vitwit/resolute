import { ADD_ICON } from '@/constants/image-names';
import Image from 'next/image';
import React from 'react';

const AddMemberButton = ({
  handleAddPubKey,
}: {
  handleAddPubKey: () => void;
}) => {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="flex items-center gap-2 font-light text-[#fffffff0] text-[14px]"
        onClick={handleAddPubKey}
      >
        <Image src={ADD_ICON} height={20} width={20} alt="" />
        <span>Add More</span>
      </button>
    </div>
  );
};

export default AddMemberButton;
