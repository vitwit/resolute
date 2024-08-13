import React, { useState } from 'react';
import CustomDialog from './CustomDialog';
import SearchContracts from './SearchContracts';
import Image from 'next/image';

const DialogSelectContract = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };
  return (
    <CustomDialog
      open={open}
      title="Select Contract"
      onClose={onClose}
      styles="w-[800px]"
      description="Provide the contract address to search.  Once found select the contract to use it."
    >
      <div className="space-y-10">
        <SearchContracts
          searchQuery={searchQuery}
          handleSearchQueryChange={handleSearchQueryChange}
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="secondary-text">Search Results</div>
            <div className="divider-line"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <Image
                src="/akash1.png"
                width={24}
                height={24}
                alt="contracter-logo"
              />
              <p className="text-b1">Contract name</p>
            </div>
            <div className="text-b1">
              pasg14hj2tavq8fpesdwxxcu4zr3txmfvw9sq2r9g9
            </div>
            <div className="">
              <button className="primary-btn">Select</button>
            </div>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogSelectContract;
