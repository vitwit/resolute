import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setSelectedNetwork } from '@/store/features/common/commonSlice';
import { changeNetworkRoute, shortenName } from '@/utils/util';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const NetworkItem = ({
  chainName,
  chainLogo,
  pathName,
  handleClose,
  selected,
}: {
  chainName: string;
  chainLogo: string;
  pathName: string;
  handleClose: () => void;
  selected: boolean;
}) => {
  const dispatch = useAppDispatch();
  const routePath = pathName.toLowerCase().includes('/validator')
    ? '/staking'
    : pathName;

  return (
    <Link
      href={changeNetworkRoute(routePath, chainName)}
      className={`network-item ${selected ? 'bg-[#FFFFFF14] !border-transparent' : ''}`}
      onClick={() => {
        dispatch(setSelectedNetwork({ chainName: chainName.toLowerCase() }));
        handleClose();
      }}
    >
      <div className="p-1">
        <Avatar src={chainLogo} sx={{ width: 24, height: 24 }} />
      </div>
      <h3 className="network-name">{shortenName(chainName, 15)}</h3>
    </Link>
  );
};

export default NetworkItem;
