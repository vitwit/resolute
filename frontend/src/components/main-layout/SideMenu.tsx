import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MenuItem from './MenuItem';
import { getSelectedPartFromURL } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import FeegrantButton from '../common/FeegrantButton';
import AuthzButton from '../common/AuthzButton';
import Link from 'next/link';
import { Tooltip } from '@mui/material';
import { isMetaMaskWallet } from '@/utils/localStorage';
import { MenuItemI, SIDEBAR_MENU_OPTIONS } from '@/constants/sidebar-options';

const DISABLED_FOR_METAMASK = [
  'ibc-swap',
  'authz',
  'feegrant',
  'cosmwasm',
  'multi-send',
  'txn-builder',
];
const DISABLED_FOR_AUTHZ_MODE = [
  'ibc-swap',
  'feegrant',
  'cosmwasm',
  'history',
  'builder',
  'multi-send',
  'txn-builder',
];

const SideMenu = () => {
  const pathName = usePathname();
  const pathParts = pathName.split('/');
  const selectedPart = getSelectedPartFromURL(pathParts).toLowerCase();

  return (
    <div className="scrollable-content w-full">
      <div className="flex flex-col gap-2">
        {SIDEBAR_MENU_OPTIONS.map((item) =>
          item.multipleOptions ? (
            <MoreOptions
              key={item.name}
              item={item}
              selectedPart={selectedPart}
            />
          ) : (
            <MenuItem key={item.name} itemData={item} pathName={selectedPart} />
          )
        )}
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

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransfersSettingsExpanded, setIsTransfersSettingsExpanded] =
    useState(true);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleTransfersSettingsExpand = () =>
    setIsTransfersSettingsExpanded(!isTransfersSettingsExpanded);

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

  const isDisabled = (module: string) => {
    if (isMetaMaskWallet() && DISABLED_FOR_METAMASK.includes(module)) {
      return { disabled: true, tooltip: "MetaMask doesn't support" };
    }
    if (isAuthzMode && DISABLED_FOR_AUTHZ_MODE.includes(module)) {
      return { disabled: true, tooltip: `Authz is not supporting ${module}` };
    }
    return { disabled: false, tooltip: null };
  };

  return (
    <>
      {item.name.toLowerCase() === 'transfers' && (
        <div className="space-y-2 w-full">
          <div
            key={item.name}
            className="space-y-2 flex justify-between w-full items-center cursor-pointer"
            onClick={toggleTransfersSettingsExpand}
          >
            <MenuItem
              key={item.name}
              itemData={item}
              pathName={selectedPart}
              isExpanded={isTransfersSettingsExpanded}
            />
          </div>

          {isTransfersSettingsExpanded && (
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
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('multi-send').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={isDisabled('multi-send').tooltip}
                  placement="top-end"
                >
                  <div
                    onClick={() => {
                      if (!isDisabled('multi-send').disabled) {
                        changeTransfersPath('multi-send');
                      }
                    }}
                    className={`hover:font-semibold ${isDisabled('multi-send').disabled ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    Multiple
                  </div>
                </Tooltip>
              </div>
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('ibc-swap').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={isDisabled('ibc-swap').tooltip}
                  placement="top-end"
                >
                  <div
                    onClick={() => {
                      if (!isDisabled('ibc-swap').disabled)
                        changeTransfersPath('ibc-swap');
                    }}
                    className={`hover:font-semibold ${isDisabled('ibc-swap').disabled ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    IBC Swap
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      )}
      {item.name.toLowerCase() === 'transactions' && (
        <div key={item.name} className="space-y-2">
          <div
            key={item.name}
            className="space-y-2 flex justify-between items-center cursor-pointer"
            onClick={toggleExpand}
          >
            <MenuItem
              key={item.name}
              itemData={item}
              pathName={selectedPart}
              isExpanded={isExpanded}
            />
          </div>
          {isExpanded && (
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
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('txn-builder').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={
                    isDisabled('txn-builder').tooltip
                      ? 'Authz is not supporting builder'
                      : null
                  }
                  placement="top-end"
                >
                  <div
                    className={`hover:font-semibold ${isAuthzMode ? 'opacity-20 !cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Link
                      href={
                        !isDisabled('txn-builder').disabled
                          ? `/transactions/builder/${selectedNetwork.toLowerCase() || ''}`
                          : ''
                      }
                      className="hover:font-semibold"
                    >
                      Builder
                    </Link>
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      )}
      {item.name.toLowerCase() === 'settings' && (
        <div className="space-y-2">
          <div
            key={item.name}
            className="space-y-2 flex justify-between items-center cursor-pointer"
            onClick={toggleExpand}
          >
            <MenuItem
              key={item.name}
              itemData={item}
              pathName={selectedPart}
              isExpanded={isExpanded}
            />
          </div>

          {isExpanded && (
            <div className="text-[12px] font-medium space-y-4">
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('authz').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={isDisabled('authz').tooltip}
                  placement="top-end"
                >
                  <div className="flex items-center justify-between w-full">
                    <Link
                      href={
                        !isDisabled('authz').disabled
                          ? `/settings/authz/${selectedNetwork.toLowerCase() || ''}`
                          : ''
                      }
                      className="hover:font-semibold"
                    >
                      Authz Mode
                    </Link>
                    <AuthzButton disabled={isDisabled('authz').disabled} />
                  </div>
                </Tooltip>
              </div>
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('feegrant').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={isDisabled('feegrant').tooltip}
                  placement="top-end"
                >
                  <div className="flex items-center justify-between w-full">
                    <Link
                      href={
                        !isDisabled('feegrant').disabled
                          ? `/settings/feegrant/${selectedNetwork.toLowerCase() || ''}`
                          : ''
                      }
                      className="hover:font-semibold"
                    >
                      Feegrant Mode
                    </Link>
                    <FeegrantButton />
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      )}
      {item.name.toLowerCase() === 'cosmwasm' && (
        <div className="space-y-2 w-full">
          <div
            key={item.name}
            className="space-y-2 flex justify-between w-full items-center cursor-pointer"
            onClick={toggleExpand}
          >
            <MenuItem
              key={item.name}
              itemData={item}
              pathName={selectedPart}
              isExpanded={isExpanded}
            />
          </div>
          {isExpanded && (
            <div className="text-[12px] font-medium space-y-4">
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('cosmwasm').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={isDisabled('cosmwasm').tooltip}
                  placement="top-end"
                >
                  <div
                    onClick={() => changeContractsPath('codes')}
                    className={`hover:font-semibold ${isDisabled('cosmwasm').disabled ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    Codes
                  </div>
                </Tooltip>
              </div>
              <div
                className={`flex gap-2 items-center pl-3 ${isDisabled('cosmwasm').disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <div className="w-5"></div>
                <Tooltip
                  title={isDisabled('cosmwasm').tooltip}
                  placement="top-end"
                >
                  <div
                    onClick={() => changeContractsPath('contracts')}
                    className={`hover:font-semibold ${isDisabled('cosmwasm').disabled ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    Contracts
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
