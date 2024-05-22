import { SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname } from 'next/navigation';
import React from 'react';
import MenuItem from './MenuItem';

const SideMenu = () => {
  const pathName = usePathname();

  // TODO: Add more option for Transfers and Settings MenuItem
  return (
    <div className="scrollable-content w-full">
      <div className="flex flex-col gap-1">
        {SIDEBAR_MENU_OPTIONS.map((item) => (
          <MenuItem key={item.name} itemData={item} pathName={pathName} />
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
