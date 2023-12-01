import Image from 'next/image';
import React from 'react';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { capitalizeFirstLetter, formatDollarAmount } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';

const Summary = ({ chainIDs }: { chainIDs: string[] }) => {
  const [, available] = useGetAssetsAmount(chainIDs);
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  let chainName = 'All Networks';
  let imageURL = '/all-networks-icon.png';
  let firstChainName = '';

  Object.keys(nameToChainIDs).forEach((name) => {
    if (nameToChainIDs[name] === chainIDs[0]) firstChainName = name;
  });
  const chainImageURL = useAppSelector(
    (state) => state.wallet.networks[chainIDs[0]].network.logos.menu
  );

  if (chainIDs.length === 1) {
    chainName = firstChainName;
    imageURL = chainImageURL;
  }

  return (
    <div className="coloured-container relative h-[72px]">
      <Image
        src="/printed-color.png"
        width={560}
        height={72}
        alt=""
        className="absolute left-[86px] top-[-2px]"
      />
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <Image src={imageURL} width={40} height={40} alt={chainName} />
          <div className="text-sm not-italic font-normal leading-[normal]">
            {capitalizeFirstLetter(chainName)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-bold text-2xl">
            {formatDollarAmount(available)}
          </div>
          <div className="text-right text-xs not-italic font-normal leading-[normal]">
            Total Balance
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
