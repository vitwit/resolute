'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import StakingActionsMenu from './StakingActionsMenu';
import StakingCardStats from './StakingCardStats';
import { CircularProgress, Tooltip } from '@mui/material';
import ValidatorLogo from './ValidatorLogo';
import {
  StakingCardActionButtonProps,
  StakingCardActionsProps,
  StakingCardHeaderProps,
  StakingCardProps,
} from '@/types/staking';
import { capitalizeFirstLetter } from '@/utils/util';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { TxStatus } from '@/types/enums';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import { txRestake } from '@/store/features/staking/stakeSlice';
import Link from 'next/link';
import { setError } from '@/store/features/common/commonSlice';
import {
  NO_DELEGATIONS_ERROR,
  NO_REWARDS_ERROR,
  TXN_PENDING_ERROR,
} from '@/utils/errors';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

const StakingCard = ({
  processingValAddr,
  handleCardClick,
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
          processingValAddr={processingValAddr}
          handleCardClick={handleCardClick}
          toggleMenu={toggleMenu}
          menuRef={menuRef2}
          chainID={chainID}
          validatorAddress={validatorAddress}
          handleMenuAction={handleMenuAction}
          enable={validator ? true : false}
        />
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-[85%] right-[8%] z-10">
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
}: StakingCardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Tooltip title={validator} placement="top-start">
        <div className="flex-center-center gap-2 h-10 cursor-default">
          <ValidatorLogo identity={identity} width={24} height={24} />
          <div className="txt-md font-medium truncate">{validator || '-'}</div>
        </div>
      </Tooltip>
      <Link href={`/staking/${network.toLowerCase()}`}>
        <div className="flex-center-center gap-2">
          <Image
            className="rounded-full"
            src={networkLogo}
            height={20}
            width={20}
            alt={network}
            draggable={false}
          />
          <div className="txt-sm font-normal">
            {capitalizeFirstLetter(network)}
          </div>
        </div>
      </Link>
    </div>
  );
};

const StakingCardActions = ({
  toggleMenu,
  menuRef,
  chainID,
  validatorAddress,
  handleMenuAction,
  processingValAddr,
  handleCardClick,
  enable,
}: StakingCardActionsProps) => {
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
  const isClaimAll = useAppSelector(
    (state) => state?.distribution?.chains?.[chainID]?.isTxAll || false
  );
  const isReStakeAll = useAppSelector(
    (state) => state?.staking?.chains?.[chainID]?.isTxAll || false
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

  const dispatch = useAppDispatch();
  const {
    txWithdrawValidatorRewardsInputs,
    txRestakeValidatorInputs,
    txAuthzRestakeValidatorMsgs,
  } = useGetTxInputs();
  const { txAuthzRestake, txAuthzClaim } = useAuthzStakingExecHelper();
  const { getChainInfo } = useGetChainInfo();

  const claim = () => {
    if (txClaimStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: TXN_PENDING_ERROR('Claim'),
        })
      );
      return;
    }
    const txInputs = txWithdrawValidatorRewardsInputs(
      chainID,
      validatorAddress,
      delegatorAddress
    );

    handleCardClick(validatorAddress);
    if (isAuthzMode) {
      txAuthzClaim({
        grantee: txInputs.address,
        granter: authzAddress,
        pairs: [{ validator: validatorAddress, delegator: authzAddress }],
        chainID: chainID,
      });
      return;
    }
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: NO_DELEGATIONS_ERROR,
        })
      );
    }
  };

  const claimAndStake = () => {
    if (isAuthzMode) {
      const { address } = getChainInfo(chainID);
      const msgs = txAuthzRestakeValidatorMsgs(chainID, validatorAddress);
      txAuthzRestake({
        grantee: address,
        granter: authzAddress,
        msgs: msgs,
        chainID: chainID,
      });
      return;
    }
    if (txRestakeStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: TXN_PENDING_ERROR('Restake'),
        })
      );
      return;
    }
    handleCardClick(validatorAddress);
    const txInputs = txRestakeValidatorInputs(chainID, validatorAddress);
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: NO_REWARDS_ERROR,
        })
      );
    }
  };

  const delegate = () => {
    handleMenuAction('delegate');
  };
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex gap-6">
        <div className="hidden md:block">
          <StakingCardActionButton
            name={'Delegate'}
            action={delegate}
            isPending={false}
            enable={enable}
          />
        </div>
        <StakingCardActionButton
          name={'Claim'}
          action={claim}
          isPending={
            txClaimStatus === TxStatus.PENDING &&
            validatorAddress === processingValAddr &&
            !isClaimAll
          }
          enable={enable}
        />
        <StakingCardActionButton
          name={'Restake'}
          action={claimAndStake}
          isPending={
            txRestakeStatus === TxStatus.PENDING &&
            validatorAddress === processingValAddr &&
            !isReStakeAll
          }
          enable={enable}
        />
      </div>
      <Tooltip ref={menuRef} title="More options" placement="top">
        <button
          className={
            enable ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'
          }
          onClick={() => toggleMenu()}
          disabled={!enable}
        >
          <Image
            src="/menu-icon.svg"
            height={32}
            width={32}
            alt="Actions"
            draggable={false}
          />
        </button>
      </Tooltip>
    </div>
  );
};

const StakingCardActionButton = ({
  name,
  action,
  isPending,
  enable,
}: StakingCardActionButtonProps) => {
  return (
    <button
      className={
        enable
          ? 'staking-card-action-button'
          : 'staking-card-action-button delegate-button-disabled'
      }
      onClick={() => action()}
      disabled={isPending || !enable}
    >
      {isPending ? (
        <CircularProgress size={16} sx={{ color: 'white' }} />
      ) : (
        <span>{name}</span>
      )}
    </button>
  );
};
