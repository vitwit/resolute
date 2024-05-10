import React, { useState } from 'react';
import DialogSearchContract from './DialogSearchContract';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import ContractSelected from './ContractSelected';
import ContractNotSelected from './ContractNotSelected';

interface SearchContractsI {
  chainID: string;
  selectedContract: { address: string; name: string };
  handleSelectContract: (address: string, name: string) => void;
}

const SearchContracts = (props: SearchContractsI) => {
  const { chainID, handleSelectContract, selectedContract } = props;

  // DEPENDENCIES
  const { getChainInfo } = useGetChainInfo();
  const { restURLs } = getChainInfo(chainID);

  // STATE
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // CHANGE HANDLER
  const handleClose = () => {
    setSearchDialogOpen(false);
  };

  return (
    <>
      <div
        className={`selected-contract ${!selectedContract.address ? 'cursor-pointer' : 'cursor-default'}`}
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
        onClose={handleClose}
        restURLs={restURLs}
        chainID={chainID}
        handleSelectContract={handleSelectContract}
      />
    </>
  );
};

export default SearchContracts;
