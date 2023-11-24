'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import StakingActionsMenu from './StakingActionsMenu';
import StakingCardStats from './StakingCardStats';
import { Tooltip } from '@mui/material';
import ValidatorLogo from './ValidatorLogo';

type ToogleMenu = () => void;

const StakingCard = ({
  validator,
  identity,
  chainName,
  commission,
  delegated,
  networkLogo,
  rewards,
  coinDenom,
}: {
  validator: string;
  identity: string;
  chainName: string;
  commission: number;
  delegated: number;
  networkLogo: string;
  coinDenom: string;
  rewards: number;
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuRef2.current &&
        !menuRef2.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      <div className="staking-card">
        <StakingCardHeader
          validator={validator}
          identity={identity}
          network={chainName}
          networkLogo={networkLogo}
        />
        <StakingCardStats
          delegated={delegated}
          rewards={rewards}
          commission={commission}
          coinDenom={coinDenom}
        />
        <StakingCardActions toggleMenu={toggleMenu} menuRef2={menuRef2} />
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-[82%] right-[13%] z-10">
          <StakingActionsMenu />
        </div>
      )}
    </div>
  );
};

export default StakingCard;

export const StakingCardHeader = ({
  validator,
  identity,
  network,
  networkLogo,
}: {
  validator: string;
  identity: string;
  network: string;
  networkLogo: string;
}) => {
  return (
    <div className="flex justify-between">
      <Tooltip title={validator} placement="top-start">
        <div className="flex-center-center gap-1 h-10 cursor-default">
          <ValidatorLogo identity={identity} width={24} height={24} />
          <div className="txt-md font-medium w-[100px] truncate">
            {validator || '-'}
          </div>
        </div>
      </Tooltip>
      <div className="flex-center-center gap-1">
        <Tooltip title={network} placement="left">
          <Image src={networkLogo} height={24} width={24} alt={network} />
        </Tooltip>
      </div>
    </div>
  );
};

const StakingCardActions = ({
  toggleMenu,
  menuRef2,
}: {
  toggleMenu: ToogleMenu;
  menuRef2: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex gap-10">
        <StakingCardActionButton name={'Claim'} icon={'/claim-icon.svg'} />
        <StakingCardActionButton
          name={'Claim & Stake'}
          icon={'/claim-and-stake-icon.svg'}
        />
      </div>
      <Tooltip ref={menuRef2} title="More options" placement="top">
        <div className="cursor-pointer" onClick={() => toggleMenu()}>
          <Image src="/menu-icon.svg" height={32} width={32} alt="Actions" />
        </div>
      </Tooltip>
    </div>
  );
};

const StakingCardActionButton = ({
  name,
  icon,
}: {
  name: string;
  icon: string;
}) => {
  return (
    <Tooltip title={name}>
      <div className="primary-gradient staking-card-action-button">
        <Image src={icon} height={16} width={16} alt={name} />
      </div>
    </Tooltip>
  );
};
