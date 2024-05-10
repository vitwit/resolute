import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SIDENAV_MENU_ITEMS } from '@/utils/constants';
import Link from 'next/link';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { tabLink } from '@/utils/util';
import { Tooltip } from '@mui/material';

const MoreOptions = () => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuRef2.current &&
        !menuRef2.current.contains(event.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="cursor-pointer sidebar-menu-item relative">
      <div
        ref={menuRef2}
        onMouseEnter={() => setOptionsOpen(true)}
        onMouseLeave={() => setOptionsOpen(false)}
        title="Advanced"
        className="relative"
      >
        <Image
          onClick={() => setOptionsOpen((prev) => !prev)}
          src="/menu-icon-filled.svg"
          height={30}
          width={30}
          alt={'Advanced'}
        />
      </div>
      {optionsOpen && (
        <div
          ref={menuRef}
          className="absolute right-[-130px] top-4 z-[100]"
          onMouseEnter={() => setOptionsOpen(true)}
          onMouseLeave={() => setOptionsOpen(false)}
        >
          <div className="more-options-menu py-4 flex flex-col gap-2">
            {SIDENAV_MENU_ITEMS.moreOptions.map((option) => {
              const isMetamaskSupported = () =>
                option.isMetaMaskSupports ||
                localStorage.getItem('WALLET_NAME') !== 'metamask';
              const authzSupport = !isAuthzMode || option.authzSupported;
              return (
                <Link
                  href={
                    isMetamaskSupported() === false
                      ? ''
                      : authzSupport
                        ? tabLink(option.link, selectedNetwork)
                        : ''
                  }
                  key={option.link}
                >
                  <Tooltip
                    className={
                      isMetamaskSupported() === false
                        ? 'cursor-not-allowed'
                        : authzSupport
                          ? ''
                          : 'cursor-not-allowed'
                    }
                    title={
                      isMetamaskSupported() === false
                        ? "MetaMask doesn't support " + option.name
                        : authzSupport
                          ? option.name
                          : 'authz mode is not supported for ' + option.name
                    }
                    placement="right"
                  >
                    <div className="more-options-menu-item">
                      <div className="w-[45px] h-[45px] flex-center-center">
                        <Image
                          src={option.icon}
                          height={
                            option.link.includes('cosmwasm') ||
                            option.link.includes('history')
                              ? 32
                              : 45
                          }
                          width={
                            option.link.includes('cosmwasm') ||
                            option.link.includes('history')
                              ? 32
                              : 45
                          }
                          alt={option.name}
                        />
                      </div>
                      <div>{option.name}</div>
                    </div>
                  </Tooltip>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptions;
