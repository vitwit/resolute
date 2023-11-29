import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React, { useState } from 'react';
import Image from 'next/image';
import { capitalizeFirstLetter } from '../../../utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';

type SetSelectedAssetAction = React.Dispatch<
  React.SetStateAction<ParsedAsset | undefined>
>;

const SendPage = ({ chainID }: { chainID: string }) => {
  const [sortedAssets] = useSortedAssets([chainID]);
  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | undefined>(
    sortedAssets[0]
  );
  const slicedAssets = sortedAssets.slice(0, 4);

  return (
    <div className="h-full w-full space-y-6">
      <div className="space-y-4">
        <div>Assets</div>
        {slicedAssets.length && (
          <Cards
            chainID={chainID}
            assets={slicedAssets}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
        )}
        <div className="w-fill flex justify-center h-6 text-[#c3c2c9] text-xs not-italic font-normal leading-6 underline">
          {sortedAssets.length > 4 ? 'View All' : ''}
        </div>
      </div>
    </div>
  );
};

export default SendPage;

const Cards = ({
  assets,
  selectedAsset,
  setSelectedAsset,
  chainID,
}: {
  assets: ParsedAsset[];
  selectedAsset: ParsedAsset | undefined;
  setSelectedAsset: SetSelectedAssetAction;
  chainID: string;
}) => {
  const imageURL = useAppSelector(
    (state) => state.wallet.networks[chainID].network.logos.menu
  );

  return (
    <div className="flex justify-start gap-4 mx-4">
      {assets.map((asset) => (
        <div
          className={
            'w-1/4 card p-4' +
            (asset.denom === selectedAsset?.denom ? ' selected' : '')
          }
          onClick={() => setSelectedAsset(asset)}
        >
          <div className="flex gap-2">
            <Image
              src={imageURL}
              width={32}
              height={32}
              alt={asset.chainName}
            />
            <div className='flex items-center text-[14]'> {capitalizeFirstLetter(asset.chainName)}</div>
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
  );
};
