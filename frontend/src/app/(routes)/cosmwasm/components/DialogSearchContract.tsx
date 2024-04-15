import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import SelectSearchType from './SelectSearchType';
import CommonCopy from '@/components/CommonCopy';
import { shortenName } from '@/utils/util';

// Sample data
const contracts = [
  {
    name: 'contract1',
    address: 'osmo1e7wpfwm66l3sfnvnsckr4dvxapdqnfyjph3pdrnuv66xjsmau3js945z8s',
  },
  {
    name: 'contract2',
    address: 'osmo1e7wpfwm66l3sfnvnsckr4dvxapdqnfyjph3pdrnuv66xjsmau3js945z8s',
  },
  {
    name: 'contract3',
    address: 'osmo1e7wpfwm66l3sfnvnsckr4dvxapdqnfyjph3pdrnuv66xjsmau3js945z8s',
  },
  {
    name: 'contract4',
    address: 'osmo1e7wpfwm66l3sfnvnsckr4dvxapdqnfyjph3pdrnuv66xjsmau3js945z8s',
  },
  {
    name: 'contract5',
    address: 'osmo1e7wpfwm66l3sfnvnsckr4dvxapdqnfyjph3pdrnuv66xjsmau3js945z8s',
  },
];

const DialogSearchContract = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleClose = () => {
    onClose();
  };
  const [isEnterManually, setIsEnterManually] = useState(false);
  const onSelect = (value: boolean) => {
    setIsEnterManually(value);
  };
  const [searchTerm, setSearchTerm] = useState('');
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
            <div className="w-full">
              <SeachInputField
                searchTerm={searchTerm}
                setSearchTerm={(value: string) => setSearchTerm(value)}
              />
            </div>
            <div className="w-full space-y-6">
              {contracts.map((contract) => (
                <ContractItem
                  key={contract.address}
                  name={contract.name}
                  address={contract.address}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSearchContract;

const ContractItem = ({ name, address }: { name: string; address: string }) => {
  return (
    <div className="flex gap-4 justify-between items-center">
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
