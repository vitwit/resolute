import { MenuItemI, SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import MenuItem from './MenuItem';
import { getSelectedPartFromURL } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantButton from '../common/FeegrantButton';
import AuthzButton from '../common/AuthzButton';
import Link from 'next/link';
import { Tooltip } from '@mui/material';

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
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const changeTransfersPath = (type: string) => {
    const path = selectedNetwork
      ? `/transfers/${selectedNetwork.toLowerCase()}?type=${type}`
      : `/transfers?type=${type}`;
    router.push(path);
  };

  const changeContractsPath = (tab: string) => {
    const queryParams = tab ? `?tab=${tab}` : '';
    const path = selectedNetwork
      ? `/cosmwasm/${selectedNetwork.toLowerCase()}${queryParams}`
      : `/cosmwasm${queryParams}`;
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
                onClick={() => changeTransfersPath('single')}
                className="cursor-pointer hover:font-semibold"
              >
                Single
              </div>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <Tooltip
                title={isAuthzMode ? 'Authz is not supporting Multiple' : null}
                placement="top-end"
              >
                <div
                  onClick={() => {
                    if (!isAuthzMode) {
                      changeTransfersPath('multi-send');
                    }
                  }}
                  className={`hover:font-semibold ${isAuthzMode ? 'opacity-20 !cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Multiple
                </div>
              </Tooltip>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <Tooltip
                title={isAuthzMode ? 'Authz is not supporting IBC Swap' : null}
                placement="top-end"
              >
                <div
                  onClick={() => {
                    if (!isAuthzMode) changeTransfersPath('ibc-swap');
                  }}
                  className={`hover:font-semibold ${isAuthzMode ? 'opacity-20 !cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  IBC Swap
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      ) : null}
      {item.name.toLowerCase() === 'transactions' ? (
        <div key={item.name} className="space-y-2">
          <MenuItem key={item.name} itemData={item} pathName={selectedPart} />
          <div className="text-[12px] font-medium space-y-4">
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div className="cursor-pointer hover:font-semibold">
                <Link
                  href={`/transactions/history/${selectedNetwork.toLowerCase() || ''}`}
                  className="hover:font-semibold"
                >
                  History
                </Link>
              </div>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <Tooltip
                title={isAuthzMode ? 'Authz is not supporting builder' : null}
                placement="top-end"
              >
                <div
                  className={`hover:font-semibold ${isAuthzMode ? 'opacity-20 !cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Link
                    href={`/transactions/builder/${selectedNetwork.toLowerCase() || ''}`}
                    className="hover:font-semibold"
                  >
                    Builder
                  </Link>
                </div>
              </Tooltip>
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
              <Link
                href={`/settings/authz/${selectedNetwork.toLowerCase() || ''}`}
                className="hover:font-semibold"
              >
                Authz Mode
              </Link>
              <AuthzButton />
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/settings/feegrant/${selectedNetwork.toLowerCase() || ''}`}
                  className="hover:font-semibold"
                >
                  Feegrant Mode
                </Link>
                <FeegrantButton />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {item.name.toLowerCase() === 'smart contracts' ? (
        <div key={item.name} className="space-y-2">
          <MenuItem key={item.name} itemData={item} pathName={selectedPart} />
          <div className="text-[12px] font-medium space-y-4">
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div
                onClick={() => {
                  changeContractsPath('');
                }}
                className="cursor-pointer hover:font-semibold"
              >
                Query / Execute
              </div>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div
                onClick={() => {
                  changeContractsPath('codes');
                }}
                className="cursor-pointer hover:font-semibold"
              >
                Codes
              </div>
            </div>
            <div className="flex gap-2 items-center pl-3">
              <div className="w-5"></div>
              <div
                onClick={() => {
                  changeContractsPath('deploy');
                }}
                className="cursor-pointer hover:font-semibold"
              >
                Deploy
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
