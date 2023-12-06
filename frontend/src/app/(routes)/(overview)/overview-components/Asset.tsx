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
        <div>{formatCoin(asset.balance, asset.displayDenom)}</div>
        {showChainName && (
          <div className="text-xs text-[#a7a2b5] font-thin leading-[normal]">
            on{' '}
            <Link href={`/overview/${asset.chainName}`}>{asset.chainName}</Link>
          </div>
        )}
      </td>
      <td>
        {asset.type === 'native'
          ? formatCoin(asset.staked, asset.displayDenom)
          : '-'}
      </td>
      <td>
        {asset.type === 'native'
          ? formatCoin(asset.rewards, asset.displayDenom)
          : '-'}
      </td>
      <td>
        <div className="flex gap-2" style={{ alignItems: 'flex-end' }}>
          <div>{formatDollarAmount(asset.usdPrice)}</div>
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
                'text-[12px] ' +
                (asset.inflation >= 0 ? 'text-[#238636]' : 'text-[#E57575]')
              }
            >
              {formatAmount(Math.abs(asset.inflation))}%
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="flex justify-between gap-1">
          <Tooltip title="Stake" placement="top-end">
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
          <Tooltip title="Claim & Stake" placement="top-start">
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
