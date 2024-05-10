import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import SelectSearchType from './SelectSearchType';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import useContracts from '@/custom-hooks/useContracts';
import ContractItem from './ContractItem';
import SearchInputField from './SearchInputField';
import { useRouter } from 'next/navigation';

interface DialogSearchContractI {
  open: boolean;
  onClose: () => void;
  chainID: string;
  restURLs: string[];
  handleSelectContract: (address: string, name: string) => void;
}

const DialogSearchContract = (props: DialogSearchContractI) => {
  const { onClose, open, chainID, restURLs, handleSelectContract } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleClose = () => {
    onClose();
    setSearchTerm('');
    setSearchResult(null);
  };
  const [isEnterManually, setIsEnterManually] = useState(true);
  const [searchResult, setSearchResult] = useState<ContractInfoResponse | null>(
    null
  );
  const onSelect = (value: boolean) => {
    setIsEnterManually(value);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const { getContractInfo, contractLoading, contractError } = useContracts();

  const onSearchContract = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await getContractInfo({
      address: searchTerm,
      baseURLs: restURLs,
    });
    setSearchResult(data);
  };

  const onSelectContract = () => {
    if (searchResult) {
      dispatch(
        setContract({
          chainID,
          contractAddress: searchResult?.address,
          contractInfo: searchResult?.contract_info,
        })
      );
      router.push(`?contract=${searchResult?.address}`);
      handleSelectContract(
        searchResult?.address,
        searchResult?.contract_info?.label
      );
      onClose();
      setSearchTerm('');
      setSearchResult(null);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white pb-16">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={handleClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="search-contract">
            <div className="search-contract-header">
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold leading-normal">
                  Select Contract
                </h2>
                <div className="text-[14px] font-extralight">
                  Provide the contract address to search. Once found select the
                  contract to use it.
                </div>
              </div>
              <div>
                <SelectSearchType
                  isEnterManually={isEnterManually}
                  onSelect={onSelect}
                />
              </div>
            </div>
            {isEnterManually ? (
              <>
                <form
                  onSubmit={(e) => onSearchContract(e)}
                  className="w-full flex justify-between gap-4"
                >
                  <SearchInputField
                    searchTerm={searchTerm}
                    setSearchTerm={(value: string) => setSearchTerm(value)}
                  />
                  <button type="submit" className="primary-gradient search-btn">
                    Search
                  </button>
                </form>
                <div className="w-full space-y-6 h-10">
                  {contractLoading ? (
                    <div className="flex-center-center gap-2">
                      <CircularProgress sx={{ color: 'white' }} size={18} />
                      <div className="italic font-extralight text-[14px]">
                        Searching for contract{' '}
                        <span className="dots-flashing"></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {searchResult ? (
                        <div className="space-y-2">
                          <div className="font-semibold">Search Result:</div>
                          <ContractItem
                            key={searchResult?.address}
                            name={searchResult?.contract_info?.label}
                            address={searchResult?.address}
                            onSelectContract={onSelectContract}
                          />
                        </div>
                      ) : (
                        <>
                          {contractError ? (
                            <div className="search-error">
                              Error: {contractError}
                            </div>
                          ) : null}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div>Coming Soon...</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSearchContract;
