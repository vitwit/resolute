import { MenuItemI, SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname, useRouter } from 'next/navigation';
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
          <>
            {item.multipleOptions ? (
              <MoreOptions item={item} selectedPart={selectedPart} />
            ) : (
              <MenuItem
                key={item.name}
                itemData={item}
                pathName={selectedPart}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;

const MoreOptions = ({
  item,
  selectedPart,
}: {
  item: MenuItemI;
  selectedPart: string;
}) => {
  const router = useRouter();
  const changePath = (type: string) => {
    router.push(`/transfers?type=${type}`);
  };
  return (
    <>
      {item.name.toLowerCase() === 'transfers' ? (
        <div className="space-y-2">
          <MenuItem key={item.name} itemData={item} pathName={selectedPart} />
          <div className="text-[12px] font-medium space-y-4">
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div
                onClick={() => changePath('single')}
                className="cursor-pointer hover:font-semibold"
              >
                Single
              </div>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div
                onClick={() => changePath('multi-send')}
                className="cursor-pointer hover:font-semibold"
              >
                Multiple
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
