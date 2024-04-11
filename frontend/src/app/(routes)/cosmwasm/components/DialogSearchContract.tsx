import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import SelectSearchType from './SelectSearchType';

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
        <div className="w-[890px] text-white">
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
            <div className='w-full'>
              <SeachInputField
                searchTerm={searchTerm}
                setSearchTerm={(value: string) => setSearchTerm(value)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSearchContract;

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
