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
    <div className="flex bg-[#1F102D99]">
      <div className="sidebar">
        <div className="sidebar__menu">
          <Image
            src="/vitwit-logo.png"
            width={184}
            height={52}
            alt="Vitwit Logo"
          />
          <div className="flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <MenuItem
                pathname={selectedPart}
                key={index}
                itemName={item.name}
                icon={item.icon}
                selected={false}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="sidebar__footer">
          <div className="sidebar__footer__border"></div>
          <div className="sidebar__footer__authz">
            <div>Authz Mode</div>
            <div>Toggle</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center overflow-y-scroll no-scrollbar h-screen w-screen text-white">
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
  selected,
  link,
}: {
  pathname: string;
  itemName: string;
  icon: any;
  selected: boolean;
  link: string;
}) => {
  pathname = pathname.toLowerCase();
  pathname = pathname === "overview" ? "/" : `/${pathname}`;
  return (
    <Link
      className={`sidebar__menu__item ${
        pathname === link ? "sidebar__menu__item-selected" : ""
      }`}
      href={link}
    >
      <Image src={icon} width={24} height={24} alt={itemName} />
      <div className="ml-2">{itemName}</div>
    </Link>
  );
};
