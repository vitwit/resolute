import Copy from '@/components/common/Copy';
import { capitalizeFirstLetter, shortenName } from '@/utils/util';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const NetworkItem = ({
  logo,
  networkName,
  operatorAddress,
}: {
  networkName: string;
  logo: string;
  operatorAddress: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        className="rounded-full"
        src={logo}
        width={24}
        height={24}
        alt={networkName}
      />
      <Tooltip title={capitalizeFirstLetter(networkName)} placement="bottom">
        <h3 className="text-[14px] leading-normal opacity-100 w-[80px] max-w-[80px] cursor-default">
          <span>{shortenName(capitalizeFirstLetter(networkName), 10)}</span>
        </h3>
      </Tooltip>
      <Copy content={operatorAddress} height={16} width={16} />
    </div>
  );
};

export default NetworkItem;
