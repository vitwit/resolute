import { CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import useContracts from '@/custom-hooks/useContracts';
import { useRouter } from 'next/navigation';
import { shortenName } from '@/utils/util';
import CommonCopy from '@/components/CommonCopy';
import SearchInputField from './SearchInputField';
import CustomDialog from '@/components/common/CustomDialog';

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
  const [searchResult, setSearchResult] = useState<ContractInfoResponse | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState('');
  const { getContractInfo, contractLoading, contractError } = useContracts();

  const onSearchContract = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await getContractInfo({
      address: searchTerm,
      baseURLs: restURLs,
      chainID,
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
    <CustomDialog
      open={open}
      onClose={handleClose}
      title="Search Contract"
      description="Provide the contract address to search. Once found select the
    contract to use it."
    >
      <div className="w-[890px] text-white pb-16">
        <div className="search-contract">
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
                  Searching for contract <span className="dots-flashing"></span>
                </div>
              </div>
            ) : (
              <>
                {searchResult ? (
                  <div className="space-y-2">
                    <div className="font-semibold">Search Result:</div>
                    <div
                      onClick={() => onSelectContract()}
                      className="contract-item"
                    >
                      <div className="w-[20%] truncate font-semibold">
                        {shortenName(searchResult?.contract_info?.label, 20)}
                      </div>
                      <CommonCopy
                        message={searchResult?.address}
                        style="!bg-transparent"
                        plainIcon={true}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {contractError ? (
                      <div className="search-error">Error: {contractError}</div>
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CustomDialog>
  );
};

export default DialogSearchContract;
