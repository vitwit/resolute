import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip } from '@mui/material';
import { MenuItemI } from '@/constants/sidebar-options';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { tabLink } from '@/utils/util';

interface MenuItemProps {
  itemData: MenuItemI;
  pathName: string;
  isExpanded?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  itemData,
  pathName,
  isExpanded,
}) => {
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const routePath = pathName === 'overview' ? '/' : `/${pathName}`;
  const { icon, name, path, isMetaMaskSupported, authzSupported } = itemData;

  const pageLink = tabLink(path, selectedNetwork);
  const walletName = localStorage.getItem('WALLET_NAME');
  const isMetamaskSupported = isMetaMaskSupported || walletName !== 'metamask';
  const isEnableModule = !isAuthzMode || authzSupported;

  const tooltipTitle = !isMetamaskSupported
    ? "MetaMask doesn't support"
    : !isEnableModule
      ? `Authz is not supporting ${name}`
      : null;

  const isSelected = routePath === path;
  const isDisabled = !(isEnableModule && isMetamaskSupported);

  return (
    <Link href={isDisabled ? '' : pageLink} prefetch={false} className="w-full">
      <Tooltip title={tooltipTitle} placement="top-end">
        <div
          className={`menu-item ${isSelected ? 'menu-item-selected' : 'font-medium'} ${
            isDisabled ? 'opacity-20 cursor-not-allowed' : ''
          } flex justify-between w-full`}
        >
          <div className="flex gap-2">
            <Image
              src={icon}
              height={20}
              width={20}
              alt={name}
              className="opacity-60"
            />
            <div className="menu-item-name">{name}</div>
          </div>

          {itemData.multipleOptions && (
            <div>
              <Image
                src="/drop-down-icon.svg"
                width={24}
                height={24}
                alt={isExpanded ? 'collapse-icon' : 'expand-icon'}
                style={isExpanded ? { transform: 'rotate(180deg)' } : {}}
              />
            </div>
          )}
        </div>
      </Tooltip>
    </Link>
  );
};

export default MenuItem;
