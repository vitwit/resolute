'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSelectedPartFromURL } from '../utils/util';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { resetWallet } from '@/store/features/wallet/walletSlice';
import { logout } from '@/utils/localStorage';
import { RootState } from '@/store/store';
import { tabLink } from '../utils/util';
import { Tooltip } from '@mui/material';
import TransactionSuccessPopup from './TransactionSuccessPopup';
import CustomAlertBar from './CustomAlertBar';

const menuItems = [
  {
    name: 'Overview',
    icon: '/overview-icon.svg',
    activeIcon: '/overview-icon-active.svg',
    link: '/',
  },
  {
    name: 'Transfers',
    icon: '/transfers-icon.svg',
    activeIcon: '/transfers-icon-active.svg',
    link: '/transfers',
  },
  {
    name: 'Governance',
    icon: '/gov-icon.svg',
    activeIcon: '/gov-icon-active.svg',
    link: '/governance',
  },
  {
    name: 'Staking',
    icon: '/staking-icon.svg',
    activeIcon: '/staking-icon-active.svg',
    link: '/staking',
  },
  {
    name: 'Multisig',
    icon: '/multisig-icon.svg',
    activeIcon: '/multisig-icon-active.svg',
    link: '/multisig',
  },
  {
    name: 'Groups',
    icon: '/groups-icon.svg',
    activeIcon: '/groups-icon-active.svg',
    link: '/groups',
  },
  {
    name: 'Authz',
    icon: '/authz-icon.svg',
    activeIcon: '/authz-icon-active.svg',
    link: '/authz',
  },
];

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const pathParts = pathName.split('/');
  const selectedPart = getSelectedPartFromURL(pathParts).toLowerCase();
  const dispatch = useAppDispatch();

  return (
    <div className="main">
      <TransactionSuccessPopup />
      <CustomAlertBar />
      <div className="sidebar overflow-y-scroll">
        <div className="">
          <Image src="/vitwit-logo.png" height={30} width={55} alt="Resolute" />
        </div>
        <div className="flex flex-col gap-4 items-center">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              pathName={selectedPart}
              itemName={item.name}
              icon={item.icon}
              activeIcon={item.activeIcon}
              link={item.link}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Tooltip title="History" placement="right">
            <Link href="/history">
              <div
                className={`sidebar-menu-item ${
                  selectedPart === 'history' ? 'sidebar-menu-item-selected' : ''
                }`}
              >
                <Image
                  src={
                    selectedPart === 'history'
                      ? '/history-icon-active.svg'
                      : '/history-icon.svg'
                  }
                  height={40}
                  width={40}
                  alt="Resolute"
                />
              </div>
            </Link>
          </Tooltip>
          <Tooltip title="Logout" placement="right">
            <div
              className="sidebar-menu-item w-12 h-12 cursor-pointer"
              onClick={() => {
                dispatch(resetWallet());
                logout();
              }}
            >
              <Image
                src="/logout-icon.svg"
                height={40}
                width={40}
                alt="Resolute"
              />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SideBar;

const MenuItem = ({
  pathName,
  itemName,
  icon,
  activeIcon,
  link,
}: {
  pathName: string;
  itemName: string;
  icon: string;
  activeIcon: string;
  link: string;
}) => {
  const path = pathName === 'overview' ? '/' : `/${pathName}`;
  const selectedNetwork = useAppSelector(
    (state: RootState) => state.common.selectedNetwork.chainName
  );

  return (
    <Link href={tabLink(link, selectedNetwork)}>
      <Tooltip title={itemName} placement="right">
        <div
          className={`sidebar-menu-item ${
            path === link ? 'sidebar-menu-item-selected' : ''
          }`}
        >
          <div>
            <Image
              src={path === link ? activeIcon : icon}
              height={45}
              width={45}
              alt={itemName}
            />
          </div>
        </div>
      </Tooltip>
    </Link>
  );
};
