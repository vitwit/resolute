import Image from 'next/image';
import React from 'react';
import { Avatar } from '@mui/material';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { capitalizeFirstLetter, formatAmount, formatDollarAmount } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';

const Summary = ({ chainID }: { chainID: string }) => {
  const [, available] = useGetAssetsAmount([chainID]);
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  let chainName: string = '';
  Object.keys(nameToChainIDs).forEach((name) => {
    if (nameToChainIDs[name] === chainID) chainName = name;
  });
  const imageURL = useAppSelector(
    (state) => state.wallet.networks[chainID].network.logos.menu
  );

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
          <div>{capitalizeFirstLetter(chainName)}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className='font-bold text-2xl'>{formatDollarAmount(available)}</div>
          <div>Total Balance</div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
