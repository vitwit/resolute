import useChain from '@/custom-hooks/useChain';
import { capitalizeFirstLetter, shortenName } from '@/utils/util';
import { Tooltip } from '@mui/material';
import React from 'react';

const NetworkName = ({
  chainID,
  isSource,
}: {
  chainID: string;
  isSource: boolean;
}) => {
  const { getChainNameFromID } = useChain();
  const { chainName } = getChainNameFromID(chainID);
  const networkName =
    shortenName(chainName, 9) || (isSource ? 'Source' : 'Destination');
  return (
    <Tooltip title={capitalizeFirstLetter(chainName)} placement="bottom">
      <div className="bg-[#FFFFFF14] w-[120px] rounded-full py-2 px-4 text-[#ffffffad] text-center capitalize">
        {networkName}
      </div>
    </Tooltip>
  );
};

export default NetworkName;
