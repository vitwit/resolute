import { formatAmount, formatCoin, formatDollarAmount } from '@/utils/util';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { TxStatus } from '@/types/enums';
import { txRestake } from '@/store/features/staking/stakeSlice';
import { RootState } from '@/store/store';
import { CircularProgress, Tooltip } from '@mui/material';

const Asset = ({
  asset,
  showChainName,
}: {
  asset: ParsedAsset;
  showChainName: boolean;
}) => {
  const txClaimStatus = useAppSelector(
    (state: RootState) =>
      state.distribution.chains[asset.chainID]?.tx?.status || TxStatus.IDLE
  );
  const txRestakeStatus = useAppSelector(
    (state: RootState) =>
      state.staking.chains[asset.chainID]?.reStakeTxStatus || TxStatus.IDLE
  );

  const dispatch = useAppDispatch();
  const { txWithdrawAllRewardsInputs, txRestakeInputs } = useGetTxInputs();

  const claim = (chainID: string) => {
    if (txClaimStatus === TxStatus.PENDING) {
      alert('A claim transaction is already in pending...');
      return;
    }
    const txInputs = txWithdrawAllRewardsInputs(chainID);
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    else alert('no delegations');
  };

  const claimAndStake = (chainID: string) => {
    if (txRestakeStatus === TxStatus.PENDING) {
      alert('A restake transaction is already pending...');
      return;
    }
    const txInputs = txRestakeInputs(chainID);
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
    else alert('no rewards');
  };

  return (
    <tr>
      <td>
        <div className="h-[36px] flex flex-col justify-center gap-1">
          <div className="text-sm not-italic font-normal leading-[normal] h-[14px]">
            {formatCoin(asset.balance, asset.displayDenom)}
          </div>
          {showChainName ? (
            <div className="text-[10px] not-italic font-normal leading-[normal] h-[14px]">
              on{' '}
              <Link href={`/overview/${asset.chainName}`}>
                {asset.chainName}
              </Link>
            </div>
          ) : null}
        </div>
      </td>
      <td>
        <div className="text-sm not-italic font-normal leading-[normal]">
          {asset.type === 'native'
            ? formatCoin(asset.staked, asset.displayDenom)
            : '-'}
        </div>
      </td>
      <td>
        <div className="text-sm not-italic font-normal leading-[normal]">
          {asset.type === 'native'
            ? formatCoin(asset.rewards, asset.displayDenom)
            : '-'}
        </div>
      </td>
      <td>
        <div
          className="flex flex-col gap-1"
          style={{ alignItems: 'flex-start' }}
        >
          <div className="text-sm not-italic font-normal leading-[normal]">
            {formatDollarAmount(asset.usdPrice)}
          </div>
          <div className="flex">
            <Image
              src={`/${
                asset.inflation >= 0 ? 'up' : 'down'
              }-arrow-filled-icon.svg`}
              height={16}
              width={16}
              alt="inflation change"
            />
            <div
              className={
                'text-[10px] not-italic font-normal leading-[normal] ' +
                (asset.inflation >= 0 ? 'text-[#238636]' : 'text-[#E57575]')
              }
            >
              {formatAmount(Math.abs(asset.inflation))}%
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="text-sm not-italic font-normal leading-[normal]">
          {asset.type === 'native'
            ? formatDollarAmount(asset.usdValue)
            : '-'}
        </div>
      </td>
      <td>
        <div className="flex gap-10 justify-center">
          <Tooltip
            title={asset.type === 'ibc' ? '' : 'Claim'}
            placement="top-end"
          >
            <div
              className={
                'asset-action ' +
                (asset.type === 'ibc' ? 'disabled' : 'cursor-pointer')
              }
              onClick={() => {
                if (asset.type === 'native') claim(asset.chainID);
              }}
            >
              {txClaimStatus === TxStatus.PENDING ? (
                <CircularProgress size={16} />
              ) : (
                <Image
                  src="/claim-icon.svg"
                  height={16}
                  width={16}
                  alt="Claim"
                />
              )}
            </div>
          </Tooltip>
          <Tooltip
            title={asset.type === 'ibc' ? '' : 'Claim & Stake'}
            placement="top-start"
          >
            <div
              className={
                'asset-action ' +
                (asset.type === 'ibc' ? 'disabled' : 'cursor-pointer')
              }
              onClick={() => {
                if (asset.type === 'native') claimAndStake(asset.chainID);
              }}
            >
              {txRestakeStatus === TxStatus.PENDING ? (
                <CircularProgress size={16} />
              ) : (
                <Image
                  src="/claim-stake-icon.svg"
                  height={16}
                  width={16}
                  alt="Claim and Stake"
                />
              )}
            </div>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
};

export default Asset;
