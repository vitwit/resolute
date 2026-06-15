import Copy from '@/components/common/Copy';
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
    <div className="flex items-center p-4 rounded-2xl border-[0.25px] border-solid border-[rgba(255,255,255,0.20)]">
      <div className="flex justify-between items-center w-full gap-10">
        <div className="text-b1">{name}</div>
        {/* <CommonCopy message={address} style="" plainIcon={true} /> */}
        <div className="flex gap-1 items-center">
          <div className="text-b1">{address}</div>
          <Copy content={address} />
        </div>

        <button onClick={openSearchDialog} className="primary-btn">
          Change Contract
        </button>
      </div>
    </div>
  );
};

export default ContractSelected;
