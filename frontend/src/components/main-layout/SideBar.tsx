'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ExitSession from './ExitSession';
import Link from 'next/link';
import { MenuItemI, SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname } from 'next/navigation';
import { tabLink } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { Tooltip } from '@mui/material';
import { isMetaMaskWallet } from '@/utils/localStorage';

const SideBar = () => {
  return (
    <section className="sidebar">
      <div className="fixed-top w-full">
        <SelectNetwork />
      </div>
      <div className="scrollable-content w-full">
        <SideMenu />
      </div>
      <div className="fixed-bottom">
        <ExitSession />
      </div>
    </section>
  );
};

export default SideBar;

const SelectNetwork = () => {
  return (
    <div className="flex gap-2 items-center">
      <div className="network-icon-bg"></div>
      <div className="space-y-0">
        <div className="text-[16px] text-white leading-[19px]">Cosmos</div>
        <div>
          <span className="text-[#FFFFFF80] text-[12px] leading-[15px]">
            cosmos4i2uf023n...
          </span>
        </div>
      </div>
    </div>
  );
};

const SideMenu = () => {
  const pathName = usePathname();
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const [metaMaskSupported, setMetaMaskSupported] = useState(false);

  useEffect(() => {
    if (isMetaMaskWallet()) {
      setMetaMaskSupported(true);
    }
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {SIDEBAR_MENU_OPTIONS.map((item) => (
        <MenuItem
          key={item.name}
          itemData={item}
          pathName={pathName}
          authzSupported={!isAuthzMode || item.authzSupported}
          metaMaskSupported={item.isMetaMaskSupported || !metaMaskSupported}
        />
      ))}
    </div>
  );
};

const MenuItem = ({
  itemData,
  pathName,
  authzSupported,
  metaMaskSupported,
}: {
  itemData: MenuItemI;
  pathName: string;
  authzSupported: boolean;
  metaMaskSupported: boolean;
}) => {
  const routePath = pathName === 'overview' ? '/' : `${pathName}`;
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  return (
    <Link
      href={
        !metaMaskSupported
          ? ''
          : authzSupported
            ? tabLink(itemData.path, selectedNetwork)
            : ''
      }
    >
      <Tooltip
        className={
          !metaMaskSupported
            ? 'cursor-not-allowed'
            : authzSupported
              ? ''
              : 'cursor-not-allowed'
        }
        title={
          !metaMaskSupported
            ? "MetaMask doesn't support " + itemData.name
            : authzSupported
              ? null
              : 'authz mode is not supported for ' + itemData.name
        }
        placement="right"
      >
        <div
          className={`flex gap-2 h-10 items-center pl-3 pr-6 w-full rounded-lg hover:bg-[#FFFFFF0A] ${routePath === itemData.path ? 'menu-item-selected' : ''}`}
        >
          <Image src={itemData.icon} height={24} width={24} alt="Dashboard" />
          <div className="text-white text-[14px] leading-[19px]">
            {itemData.name}
          </div>
        </div>
      </Tooltip>
    </Link>
  );
};

