import { shortenName } from '@/utils/util';
import { Avatar, Tooltip } from '@mui/material';
import React from 'react';

const NetworkItem = ({
  chainName,
  logo,
  onSelect,
  selected,
  chainID,
  disable,
}: {
  chainName: string;
  logo: string;
  onSelect: (chainID: string) => void;
  selected: boolean;
  chainID: string;
  disable: boolean;
}) => {
  return (
    <div
      className={
        selected ? 'network-item network-item-selected' : 'network-item'
      }
      onClick={() => {
        if (!disable) {
          onSelect(chainID);
        }
      }}
    >
      <Avatar src={logo} sx={{ width: 32, height: 32 }} />
      <Tooltip title={chainName} placement="bottom">
        <h3 className={`text-[14px] leading-normal opacity-100`}>
          <span>{shortenName(chainName, 6)}</span>
        </h3>
      </Tooltip>
    </div>
  );
};

export default NetworkItem;
