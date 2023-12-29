import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import { customDialogPaper } from '../styles';
import { capitalizeFirstLetter } from '@/utils/util';

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
  onSelectAsset: (asset: ParsedAsset, index: number) => void;
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
                <div className="flex gap-2 items-center">
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <Image
                      className="rounded-full"
                      src={asset.chainLogoURL}
                      width={32}
                      height={32}
                      alt={asset.chainName}
                    />

                    {/* <Image
                className="rounded-full hover:w-24"
                src={
                  '/' +
                  (asset.type === 'ibc'
                    ? asset.originDenomChainInfo.chainLogo
                    : '')
                }
                width={20}
                height={20}
                alt={asset.chainName}
                style={{ position: 'absolute', bottom: -5, left: -7 }}
              /> */}
                  </div>
                  <div className="text-base not-italic font-bold leading-[normal]">
                    {asset.balance}
                  </div>

                  <div className="flex items-center text-sm not-italic font-normal leading-[normal] text-capitalize">
                    {asset.displayDenom}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-[#9c95ac] text-xs not-italic font-normal leading-[normal] flex items-center">
                    on {capitalizeFirstLetter(asset.chainName)}
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
