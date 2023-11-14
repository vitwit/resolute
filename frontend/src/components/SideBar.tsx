"use client"
import Image from "next/image";
import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSelectedPartFromURL } from '../utils/util';

const menuItems = [
    {
        name: '',
        icon: '/overview-icon.svg',
        link: '/',
    },
    {
        name: '',
        icon: '/transfers-icon.svg',
        link: '/transfers', 
    },
    {
        name: '',
        icon: '/governance-icon.svg',
        link: '/governance',
      },
      {
        name: '',
        icon: '/staking-icon.svg',
        link: '/staking',
      },
      {
        name: '',
        icon: '/groups-icon.svg',
        link: '/groups',
      },
      {
        name: '',
        icon: '/multisig-icon.svg',
        link: '/multisig',
      },
      {
        name: '',
        icon: '/authz-icon.svg',
        link: '/authz',
      },
]

const SideBar = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const selectedPart = getSelectedPartFromURL(pathParts);
  return (
    <div className="main">
        <div className="sidebar">
            <div className="sidebar-menu">
                <div className="sidebar-logo">
                    <Image
                        src= "/vitwit-logo.png"
                        width={55}
                        height={30}
                        alt="Vitwit Logo"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    {menuItems.map((item, index) => (
                        <MenuItem
                            pathname={selectedPart}
                            key={index}
                            itemName={item.name}
                            icon={item.icon}
                            link={item.link}
                        />
                    ))}
                </div>
                <div className="pge-content">
                    <div className="w-full">
                        {/* <div className="mx-10 mt-10 relative">TopNav</div> */}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SideBar;

const MenuItem = ({
    pathname,
    itemName,
    icon,
    link,
}: {
    pathname: string;
    itemName: string;
    icon: string;
    link: string;
}) => {
    pathname = pathname.toLowerCase();
    pathname = pathname === 'overview' ? '/' : `/${pathname}`;
    return (
        <Link 
            className={`sidebar-menu-item ${
                pathname === link ? 'sidebar-menu-item-selected' : ''
              }`}
              href={link}
            >
             <Image src={icon} width={40} height={40} alt={itemName} />
            <div className="ml-2">{itemName}</div>
            </Link>
    );
};