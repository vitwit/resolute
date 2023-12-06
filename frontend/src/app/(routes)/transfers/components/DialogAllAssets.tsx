import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import { customDialogPaper } from '../styles';

const DialogAllAssets = ({
  dialogOpen,
  assets,
  selectedAsset,
  onSelectAsset,
  handleDialogClose,
}: {
  dialogOpen: boolean;
  assets: ParsedAsset[];
  selectedAsset: ParsedAsset | undefined;
  onSelectAsset: (asset: ParsedAsset, index:number) => void;
  handleDialogClose: () => void;
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{ sx: customDialogPaper }}
    >
      <DialogContent className="flex flex-col text-white p-0">
        <div className="w-[890px] px-10 pt-6 pb-10">
          <div className=" flex justify-end ">
            <div
              onClick={() => {
                handleDialogClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src="/close-icon.svg"
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="">
            <div className="mb-6 flex justify-between">
              <h2 className="text-[20px] font-bold leading-normal">
                All Assets
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {assets.map((asset, index) => (
              <div
                className={
                  'w-full card p-4 cursor-pointer' +
                  (asset.denom === selectedAsset?.denom &&
                  asset.chainID === selectedAsset?.chainID
                    ? ' selected'
                    : '')
                }
                key={asset.chainID + ' ' + asset.denom}
                onClick={() => {
                  onSelectAsset(asset, index);
                  handleDialogClose();
                }}
              >
                <div className="flex gap-2">
                  <Image
                    src={asset.chainLogoURL}
                    width={32}
                    height={32}
                    alt={asset.chainName}
                  />
                  <div className="flex items-center text-[14] text-capitalize">
                    {asset.chainName}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-base not-italic font-bold leading-[normal]">
                    {asset.balance}
                  </div>
                  <div className="text-[#9c95ac] text-xs not-italic font-normal leading-[normal] flex items-center">
                    {asset.displayDenom}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAllAssets;
