'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSelectedPartFromURL } from '../utils/util';

const menuItems = [
  {
    name: '',
    icon: '/overview-icon.svg',
    activeIcon: '/overview-icon-active.svg',
    link: '/',
  },
  {
    name: '',
    icon: '/transfers-icon.svg',
    activeIcon: '/transfers-icon-active.svg',
    link: '/transfers',
  },
  {
    name: '',
    icon: '/gov-icon.svg',
    activeIcon: '/gov-icon-active.svg',
    link: '/governance',
  },
  {
    name: '',
    icon: '/staking-icon.svg',
    activeIcon: '/staking-icon-active.svg',
    link: '/staking',
  },
  {
    name: '',
    icon: '/groups-icon.svg',
    activeIcon: '/groups-icon-active.svg',
    link: '/groups',
  },
  {
    name: '',
    icon: '/multisig-icon.svg',
    activeIcon: '/multisig-icon-active.svg',
    link: '/multisig',
  },
  {
    name: '',
    icon: '/authz-icon.svg',
    activeIcon: '/authz-icon-active.svg',
    link: '/authz',
  },
];

const SideBar = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const pathParts = pathName.split('/');
  const selectedPart = getSelectedPartFromURL(pathParts);
  return (
    <div className="main">
      <div className="sidebar">
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
      </div>
      <div>{children}</div>
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
  pathName = pathName.toLowerCase();
  pathName = pathName === 'overview' ? '/' : `/${pathName}`;
  return (
    <Link href={link}>
      <div
        className={`sidebar-menu-item ${
          pathName === link ? 'sidebar-menu-item-selected' : ''
        }`}
      >
        <div>
          <Image
            src={pathName === link ? activeIcon : icon}
            height={45}
            width={45}
            alt={itemName}
          />
        </div>
      </div>
    </Link>
  );
};
