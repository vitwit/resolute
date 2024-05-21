'use client';

import Image from 'next/image';
import React from 'react';
import ExitSession from './ExitSession';
import Link from 'next/link';
import { MenuItemI, SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname } from 'next/navigation';
import { tabLink } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { Tooltip } from '@mui/material';
import { isMetaMaskWallet } from '@/utils/localStorage';

const Sidebar = () => {
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

export default Sidebar;

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

  return (
    <div className="flex flex-col gap-1">
      {SIDEBAR_MENU_OPTIONS.map((item) => (
        <MenuItem
          key={item.name}
          itemData={item}
          pathName={pathName}
          authzSupported={!isAuthzMode || item.authzSupported}
        />
      ))}
    </div>
  );
};

const MenuItem = ({
  itemData,
  pathName,
  authzSupported,
}: {
  itemData: MenuItemI;
  pathName: string;
  authzSupported: boolean;
}) => {
  const routePath = pathName === 'overview' ? '/' : `${pathName}`;
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const isMetamaskSupported = () =>
    itemData.isMetaMaskSupported || !isMetaMaskWallet();

  return (
    <Link
      href={
        isMetamaskSupported() === false
          ? ''
          : authzSupported
            ? tabLink(itemData.path, selectedNetwork)
            : ''
      }
    >
      <Tooltip
        className={
          isMetamaskSupported() === false
            ? 'cursor-not-allowed'
            : authzSupported
              ? ''
              : 'cursor-not-allowed'
        }
        title={
          isMetamaskSupported() === false
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

const SidebarOptions = () => {
  return (
    <div>
      <div className="flex gap-2 h-10 items-center px-6">
        <Image
          src="/dashboard-icon.svg"
          height={24}
          width={24}
          alt="Dashboard"
        />
        <div className="text-white text-[16px] leading-[19px]">Dashboard</div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className=" px-6">
        <div className="flex gap-2 h-10 items-center">
          <Image src="/staking-icon.svg" height={24} width={24} alt="Staking" />
          <div className="text-white text-[16px] leading-[19px]">Staking</div>
        </div>
        <div className="text-[14px] text-[#FFFFFFBF]">
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>Validators</div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>My Validators</div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className="flex gap-2 h-10 items-center px-6">
        <Image src="/gov-icon.svg" height={24} width={24} alt="Governance" />
        <div className="text-white text-[16px] leading-[19px]">Governance</div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className=" px-6">
        <div className="flex gap-2 h-10 items-center">
          <Image
            src="/transfers-icon.svg"
            height={24}
            width={24}
            alt="Transfers"
          />
          <div className="text-white text-[16px] leading-[19px]">Transfers</div>
        </div>
        <div className="text-[14px] text-[#FFFFFFBF]">
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>Single</div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>Multiple</div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>IBC Swap</div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className=" px-6">
        <div className="flex gap-2 h-10 items-center">
          <Image
            src="/transfers-icon.svg"
            height={24}
            width={24}
            alt="Transfers"
          />
          <div className="text-white text-[16px] leading-[19px]">Transfers</div>
        </div>
        <div className="text-[14px] text-[#FFFFFFBF]">
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>Single</div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>Multiple</div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div>IBC Swap</div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className="flex gap-2 h-10 items-center px-6">
        <Image src="/multisig-icon.svg" height={24} width={24} alt="Multisig" />
        <div className="text-white text-[16px] leading-[19px]">Multisig</div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className="flex gap-2 h-10 items-center px-6">
        <Image
          src="/dashboard-icon.svg"
          height={24}
          width={24}
          alt="Smart Contracts"
        />
        <div className="text-white text-[16px] leading-[19px]">
          Smart Contracts
        </div>
      </div>
      <div className="h-[1px] bg-[#1c1c20] my-2"></div>
      <div className=" px-6">
        <div className="flex gap-2 h-10 items-center">
          <Image
            src="/settings-icon.svg"
            height={24}
            width={24}
            alt="Transfers"
          />
          <div className="text-white text-[16px] leading-[19px]">Settings</div>
        </div>
        <div className="text-[14px] text-[#FFFFFFBF]">
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div className="w-full flex justify-between items-center">
              <div>Authz Mode</div>
              <Image src="/switch-on.svg" width={24} height={17} alt="On" />
            </div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div className="w-full flex justify-between items-center">
              <div>FeeGrant</div>
              <Image src="/switch-on.svg" width={24} height={17} alt="On" />
            </div>
          </div>
          <div className="flex gap-2 h-8 items-center">
            <div className="w-6"></div>
            <div className="w-full">General</div>
          </div>
        </div>
      </div>
    </div>
  );
};
