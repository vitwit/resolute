import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import SelectSearchType from './SelectSearchType';
import CommonCopy from '@/components/CommonCopy';
import { shortenName } from '@/utils/util';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setContract } from '@/store/features/cosmwasm/cosmwasmSlice';
import useContracts from '@/custom-hooks/useContracts';

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
  const handleClose = () => {
    onClose();
  };
  const [isEnterManually, setIsEnterManually] = useState(false);
  const [searchResult, setSearchResult] = useState<ContractInfoResponse | null>(
    null
  );
  const onSelect = (value: boolean) => {
    setIsEnterManually(value);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const { getContractInfo, contractLoading, contractError } = useContracts();

  const onSearchContract = async () => {
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
      handleSelectContract(
        searchResult?.address,
        searchResult?.contract_info?.label
      );
      onClose();
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
        <div className="w-[890px] text-white pb-10">
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
          <div className="mb-10 flex gap-6 px-10 items-center flex-col">
            <div className="flex flex-col gap-4 w-full pb-2 border-b-[1px] border-[#ffffff33]">
              <div className="space-y-2">
                <h2 className="text-[20px] font-bold leading-normal">
                  Select Contract
                </h2>
                {/* TODO: Update the dummy description */}
                <div className="text-[14px] font-extralight">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Animi dolorum consectetur veritatis Lorem ipsum dolor sit
                  Lorem ipsum dolor sit amet consectetur adipisicing elit..
                </div>
              </div>
              <div>
                <SelectSearchType
                  isEnterManually={isEnterManually}
                  onSelect={onSelect}
                />
              </div>
            </div>
            <div className="w-full flex justify-between gap-4">
              <SeachInputField
                searchTerm={searchTerm}
                setSearchTerm={(value: string) => setSearchTerm(value)}
              />
              <button
                onClick={() => onSearchContract()}
                className="primary-gradient font-medium rounded-lg px-3 py-[6px]"
              >
                Search
              </button>
            </div>
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
                    <ContractItem
                      key={searchResult.address}
                      name={searchResult.contract_info.label}
                      address={searchResult.address}
                      onSelectContract={onSelectContract}
                    />
                  ) : (
                    <>
                      {contractError ? (
                        <div className="text-red-500 font-light text-center">
                          Error: {contractError}
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSearchContract;

const ContractItem = ({
  name,
  address,
  onSelectContract,
}: {
  name: string;
  address: string;
  onSelectContract: () => void;
}) => {
  return (
    <div
      onClick={() => onSelectContract()}
      className="flex gap-4 justify-between items-center px-2 py-3 bg-[#ffffff14] rounded-lg cursor-pointer hover:bg-[#ffffff18]"
    >
      <div className="w-[20%] truncate">{shortenName(name, 20)}</div>
      <CommonCopy message={address} style="!bg-[#FFFFFF0D]" plainIcon={true} />
    </div>
  );
};

const SeachInputField = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  return (
    <div className="search-contract-field">
      <div>
        <Image
          src="/search-icon.svg"
          width={24}
          height={24}
          alt="Search"
          draggable={false}
        />
      </div>
      <div className="w-full">
        <input
          className="search-contract-input focus:border-[1px]"
          type="text"
          placeholder="Search Contract"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
        />
      </div>
    </div>
  );
};
