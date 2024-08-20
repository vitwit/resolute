import { MenuItemI } from '@/constants/sidebar-options';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { tabLink } from '@/utils/util';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MenuItemProps {
  itemData: MenuItemI;
  pathName: string;
}

const MenuItem = (props: MenuItemProps) => {
  const { itemData, pathName } = props;
  const routePath = pathName === 'overview' ? '/' : `/${pathName}`;
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const { icon, name, path } = itemData;
  const pageLink = tabLink(path, selectedNetwork);
  const isEnableModule = !isAuthzMode || itemData.authzSupported

  return (
    <Link href={isEnableModule ? pageLink : ''} prefetch={false}>
      <Tooltip
        title={
          !isEnableModule
            ? `Authz is not supporting ${name}` 
            : null
        }
        placement="top-end"
      >
        <div
          className={`menu-item ${routePath === path ? 'menu-item-selected' : 'font-medium'} ${isEnableModule ? '' : 'opacity-20 cursor-not-allowed'}`}
        >
          <Image
            src={icon}
            height={20}
            width={20}
            alt="Dashboard"
            className="opacity-60"
          />
          <div className="menu-item-name">{name}</div>
        </div>
      </Tooltip>
    </Link>
  );
};

export default MenuItem;
