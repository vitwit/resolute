import { SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname } from 'next/navigation';
import React from 'react';
import MenuItem from './MenuItem';
import { getSelectedPartFromURL } from '@/utils/util';

const SideMenu = () => {
  const pathName = usePathname();
  const pathParts = pathName.split('/');
  const selectedPart = getSelectedPartFromURL(pathParts).toLowerCase();

  // TODO: Add more option for Transfers and Settings MenuItem
  return (
    <div className="scrollable-content w-full">
      <div className="flex flex-col gap-2">
        {SIDEBAR_MENU_OPTIONS.map((item) => (
          <MenuItem key={item.name} itemData={item} pathName={selectedPart} />
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
