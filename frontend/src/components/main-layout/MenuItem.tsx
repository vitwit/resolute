import { MenuItemI } from '@/constants/sidebar-options';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { tabLink } from '@/utils/util';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MenuItemProps {
  itemData: MenuItemI;
  pathName: string;
}

const MenuItem = (props: MenuItemProps) => {
  const { itemData, pathName } = props;
  const routePath = pathName === 'overview' ? '/' : `/${pathName}`;
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const { icon, name, path } = itemData;
  const pageLink = tabLink(path, selectedNetwork);

  return (
    <Link href={pageLink} prefetch={false}>
      <div
        className={`menu-item ${routePath === path ? 'menu-item-selected' : 'font-medium'}`}
      >
        <Image src={icon} height={20} width={20} alt="Dashboard" />
        <div className="menu-item-name">{name}</div>
      </div>
    </Link>
  );
};

export default MenuItem;
