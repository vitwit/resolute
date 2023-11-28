'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import StakingActionsMenu from './StakingActionsMenu';
import StakingCardStats from './StakingCardStats';
import { CircularProgress, Tooltip } from '@mui/material';
import ValidatorLogo from './ValidatorLogo';
import { StakingCardProps } from '@/types/staking';
import { capitalizeFirstLetter } from '@/utils/util';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { TxStatus } from '@/types/enums';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import { txRestake } from '@/store/features/staking/stakeSlice';

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
  onMenuAction,
  validatorInfo,
  chainID,
}: StakingCardProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (type: string) => {
    onMenuAction(type, validatorInfo);
  };

  const validatorAddress = validatorInfo?.operator_address;

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
        <StakingCardActions
          toggleMenu={toggleMenu}
          menuRef2={menuRef2}
          chainID={chainID}
          validatorAddress={validatorAddress}
        />
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-[82%] right-[13%] z-10">
          <StakingActionsMenu handleMenuAction={handleMenuAction} />
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
        <div className="flex-center-center gap-2 h-10 cursor-default">
          <ValidatorLogo identity={identity} width={24} height={24} />
          <div className="txt-md font-medium truncate">{validator || '-'}</div>
        </div>
      </Tooltip>
      <div className="flex-center-center gap-2">
        <Image src={networkLogo} height={20} width={20} alt={network} />
        <div className="txt-sm font-normal">
          {capitalizeFirstLetter(network)}
        </div>
      </div>
    </div>
  );
};

const StakingCardActions = ({
  toggleMenu,
  menuRef2,
  chainID,
  validatorAddress,
}: {
  toggleMenu: ToogleMenu;
  menuRef2: React.RefObject<HTMLDivElement>;
  chainID: string;
  validatorAddress: string;
}) => {
  const delegatorAddress = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID]?.walletInfo?.bech32Address
  );
  const txClaimStatus = useAppSelector(
    (state: RootState) => state.distribution.chains[chainID]?.tx.status
  );
  const txRestakeStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.reStakeTxStatus
  );

  const dispatch = useAppDispatch();
  const { txWithdrawValidatorRewardsInputs, txRestakeInputs } =
    useGetTxInputs();

  const claim = () => {
    if (txClaimStatus === TxStatus.PENDING) {
      alert('A claim transaction is already in pending...');
      return;
    }
    const txInputs = txWithdrawValidatorRewardsInputs(
      chainID,
      validatorAddress,
      delegatorAddress
    );
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    else alert('no delegations');
  };

  const claimAndStake = () => {
    if (txRestakeStatus === TxStatus.PENDING) {
      alert('A restake transaction is already pending...');
      return;
    }
    const txInputs = txRestakeInputs(chainID);
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
    else alert('Not enough rewards to claim');
  };
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex gap-10">
        <StakingCardActionButton
          name={'Claim'}
          icon={'/claim-icon.svg'}
          action={claim}
          txStatus={txClaimStatus}
        />
        <StakingCardActionButton
          name={'Claim & Stake'}
          icon={'/claim-and-stake-icon.svg'}
          action={claimAndStake}
          txStatus={txRestakeStatus}
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
  action,
  txStatus,
}: {
  name: string;
  icon: string;
  action: () => void;
  txStatus: string;
}) => {
  return (
    <Tooltip title={name}>
      <div
        className="primary-gradient staking-card-action-button"
        onClick={() => action()}
      >
        {txStatus === TxStatus.PENDING ? (
          <CircularProgress size={16} sx={{ color: 'purple' }} />
        ) : (
          <Image src={icon} height={16} width={16} alt={name} />
        )}
      </div>
    </Tooltip>
  );
};
