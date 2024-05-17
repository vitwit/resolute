import CommonCopy from '@/components/CommonCopy';
import React from 'react';

const ContractSelected = ({
  contract,
  openSearchDialog,
}: {
  contract: { address: string; name: string };
  openSearchDialog: () => void;
}) => {
  const { address, name } = contract;
  return (
    <div className="flex justify-between items-center w-full gap-10">
      <div className="flex items-center gap-10">
        <div className="text-[14px]">{name}</div>
        <CommonCopy message={address} style="" plainIcon={true} />
      </div>
      <button
        onClick={openSearchDialog}
        className="primary-gradient change-btn"
      >
        Change Contract
      </button>
    </div>
  );
};

export default ContractSelected;
