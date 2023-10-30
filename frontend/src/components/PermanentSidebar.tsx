"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import TopNav from "./TopNav";
import { getSelectedPartFromURL } from "../utils/util";

const menuItems = [
  {
    name: "Overview",
    icon: "/overview-icon.svg",
    link: "/",
  },
  {
    name: "Transfers",
    icon: "/transfers-icon.svg",
    link: "/transfers",
  },
  {
    name: "Governance",
    icon: "/gov-icon.svg",
    link: "/governance",
  },
  {
    name: "Staking",
    icon: "/staking-icon.svg",
    link: "/staking",
  },
  {
    name: "Multisig",
    icon: "/multisig-icon.svg",
    link: "/multisig",
  },
  {
    name: "Authz",
    icon: "/authz-icon.svg",
    link: "/authz",
  },
  {
    name: "Feegrant",
    icon: "/feegrant-icon.svg",
    link: "/feegrant",
  },
  {
    name: "Groups",
    icon: "/groups-icon.svg",
    link: "/groups",
  },
];

const PermanentSidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const selectedPart = getSelectedPartFromURL(pathParts);
  return (
    <div className="main">
      <div className="sidebar">
        <div className="sidebar-menu">
          <div className="sidebar-logo">
            <Image
              src="/vitwit-logo.png"
              width={184}
              height={52}
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
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-footer-border"></div>
          <div className="sidebar-footer-authz">
            <div>Authz Mode</div>
            <div>Toggle</div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="w-full">
          <div className=" mx-10 mt-10 relative">
            <TopNav pathname={selectedPart} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PermanentSidebar;

const MenuItem = ({
  pathname,
  itemName,
  icon,
  link,
}: {
  pathname: string;
  itemName: string;
  icon: any;
  link: string;
}) => {
  pathname = pathname.toLowerCase();
  pathname = pathname === "overview" ? "/" : `/${pathname}`;
  return (
    <Link
      className={`sidebar-menu-item ${
        pathname === link ? "sidebar-menu-item-selected" : ""
      }`}
      href={link}
    >
      <Image src={icon} width={24} height={24} alt={itemName} />
      <div className="ml-2">{itemName}</div>
    </Link>
  );
};
