'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSelectedPartFromURL } from '../utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { tabLink } from '../utils/util';
import { Tooltip } from '@mui/material';
import TransactionSuccessPopup from './TransactionSuccessPopup';
import SnackBar from './SnackBar';
import {
  GITHUB_ISSUES_PAGE_LINK,
  HELP_ICON,
  REPORT_ICON,
  SIDENAV_MENU_ITEMS,
  TELEGRAM_LINK,
} from '@/utils/constants';

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const pathParts = pathName.split('/');
  const selectedPart = getSelectedPartFromURL(pathParts).toLowerCase();

  return (
    <div className="main">
      <TransactionSuccessPopup />
      <SnackBar />
      <div className="sidebar overflow-y-scroll">
        <div className="">
          <Image src="/vitwit-logo.png" height={30} width={55} alt="Resolute" />
        </div>
        <div className="flex flex-col gap-4 items-center">
          {SIDENAV_MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.name}
              pathName={selectedPart}
              itemName={item.name}
              icon={item.icon}
              activeIcon={item.activeIcon}
              link={item.link}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Tooltip title="Report an issue" placement="right">
            <Link href={GITHUB_ISSUES_PAGE_LINK}>
              <div className="sidebar-menu-item">
                <Image
                  src={REPORT_ICON}
                  height={40}
                  width={40}
                  alt="Resolute"
                />
              </div>
            </Link>
          </Tooltip>
          <Tooltip title="Need help?" placement="right">
            <Link href={TELEGRAM_LINK}>
              <div className="sidebar-menu-item">
                <Image src={HELP_ICON} height={40} width={40} alt="Resolute" />
              </div>
            </Link>
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
