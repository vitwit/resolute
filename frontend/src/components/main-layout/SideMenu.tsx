import { MenuItemI, SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import MenuItem from './MenuItem';
import { getSelectedPartFromURL } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantButton from '../common/FeegrantButton';
import AuthzButton from '../common/AuthzButton';

const SideMenu = () => {
  const pathName = usePathname();
  const pathParts = pathName.split('/');
  const selectedPart = getSelectedPartFromURL(pathParts).toLowerCase();

  return (
    <div className="scrollable-content w-full">
      <div className="flex flex-col gap-2">
        {SIDEBAR_MENU_OPTIONS.map((item, index) => (
          <>
            {item.multipleOptions ? (
              <MoreOptions
                key={index}
                item={item}
                selectedPart={selectedPart}
              />
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
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  const changePath = (type: string) => {
    const path = selectedNetwork
      ? `/transfers/${selectedNetwork.toLowerCase()}?type=${type}`
      : `/transfers?type=${type}`;
    router.push(path);
  };
  return (
    <>
      {item.name.toLowerCase() === 'transfers' ? (
        <div key={item.name} className="space-y-2">
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
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div
                onClick={() => changePath('ibc-swap')}
                className="cursor-pointer hover:font-semibold"
              >
                IBC Swap
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {item.name.toLowerCase() === 'settings' ? (
        <div key={item.name} className="space-y-2">
          <MenuItem key={item.name} itemData={item} pathName={selectedPart} />
          <div className="text-[12px] font-medium space-y-4">
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div className="cursor-pointer hover:font-semibold">
                Authz Mode
              </div>
              <AuthzButton />
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div className="flex items-center gap-2">
                <div className="cursor-pointer hover:font-semibold">
                  Feegrant Mode
                </div>
                <FeegrantButton />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
