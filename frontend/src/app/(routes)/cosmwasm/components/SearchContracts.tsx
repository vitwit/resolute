import CommonCopy from '@/components/CommonCopy';
import Image from 'next/image';
import React, { useState } from 'react';
import DialogSearchContract from './DialogSearchContract';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const SearchContracts = ({
  chainID,
  handleSelectContract,
  selectedContract,
}: {
  chainID: string;
  selectedContract: { address: string; name: string };
  handleSelectContract: (address: string, name: string) => void;
}) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const hanldeClose = () => {
    setSearchDialogOpen(false);
  };

  const { getChainInfo } = useGetChainInfo();
  const { restURLs } = getChainInfo(chainID);
  return (
    <>
      <div
        className={`px-4 py-6 border-[1px] border-[#FFFFFF80] rounded-2xl max-h-20 flex ${!selectedContract.address ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => {
          if (!selectedContract.address) setSearchDialogOpen(true);
        }}
      >
        {selectedContract.address ? (
          <ContractSelected
            contract={selectedContract}
            openSearchDialog={() => setSearchDialogOpen(true)}
          />
        ) : (
          <ContractNotSelected />
        )}
      </div>
      <DialogSearchContract
        open={searchDialogOpen}
        onClose={hanldeClose}
        restURLs={restURLs}
        chainID={chainID}
        handleSelectContract={handleSelectContract}
      />
    </>
  );
};

export default SearchContracts;

const ContractNotSelected = () => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/file-upload-icon.svg"
        width={32}
        height={32}
        alt="Search Contract"
      />
      <div>Select or search contract</div>
    </div>
  );
};

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
