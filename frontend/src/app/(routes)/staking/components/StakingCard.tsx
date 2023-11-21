'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import StakingActionsMenu from './StakingActionsMenu';
import StakingCardStats from './StakingCardStats';
import { Avatar, Tooltip } from '@mui/material';
import { capitalizeFirstLetter } from '@/utils/util';
import { deepPurple } from '@mui/material/colors';

type ToogleMenu = () => void;

const StakingCard = ({
  validator,
  chainName,
  commission,
  delegated,
  networkLogo,
  coinDenom,
}: {
  validator: string;
  chainName: string;
  commission: number;
  delegated: number;
  networkLogo: string;
  coinDenom: string;
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
          network={chainName}
          networkLogo={networkLogo}
        />
        <StakingCardStats
          delegated={delegated}
          rewards={10}
          commission={commission}
          coinDenom={coinDenom}
        />
        <StakingCardActions toggleMenu={toggleMenu} />
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-[75%] right-[4%] z-10">
          <StakingActionsMenu />
        </div>
      )}
    </div>
  );
};

export default StakingCard;

export const StakingCardHeader = ({
  validator,
  network,
  networkLogo,
}: {
  validator: string;
  network: string;
  networkLogo: string;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex-center-center gap-1 h-10">
        <Avatar sx={{ width: 32, height: 32, bgcolor: deepPurple[300] }} />
        <div className="txt-md font-medium">{validator}</div>
      </div>
      <div className="flex-center-center gap-1">
        <Image src={networkLogo} height={20} width={20} alt={network} />
        <div className="txt-sm font-extralight">
          {capitalizeFirstLetter(network)}
        </div>
      </div>
    </div>
  );
};

const StakingCardActions = ({ toggleMenu }: { toggleMenu: ToogleMenu }) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex gap-10">
        <StakingCardActionButton name={'Claim'} icon={'/claim-icon.svg'} />
        <StakingCardActionButton
          name={'Claim & Stake'}
          icon={'/claim-and-stake-icon.svg'}
        />
      </div>
      <Tooltip title="More options">
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
