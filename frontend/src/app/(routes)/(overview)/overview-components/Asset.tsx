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
import { setError } from '@/store/features/common/commonSlice';
import { capitalize } from 'lodash';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { DelegationsPairs } from '@/types/distribution';
import useAuthzStakingExecHelper from '@/custom-hooks/useAuthzStakingExecHelper';

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
  const authzRewards = useAppSelector(
    (state) => state.distribution.authzChains
  );
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const { getChainInfo } = useGetChainInfo();

  const dispatch = useAppDispatch();
  const { txWithdrawAllRewardsInputs, txRestakeInputs, txAuthzRestakeMsgs } =
    useGetTxInputs();
  const { txAuthzClaim, txAuthzRestake } = useAuthzStakingExecHelper();

  const claim = (chainID: string) => {
    if (isAuthzMode) {
      const { address } = getChainInfo(chainID);
      const pairs: DelegationsPairs[] = (
        authzRewards[chainID]?.delegatorRewards?.list || []
      ).map((reward) => {
        const pair = {
          delegator: authzAddress,
          validator: reward.validator_address,
        };
        return pair;
      });
      txAuthzClaim({
        grantee: address,
        granter: authzAddress,
        pairs: pairs,
        chainID: chainID,
      });
      return;
    }
    if (txClaimStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: `A claim transaction is still pending on ${capitalize(
            asset.chainName
          )} network...`,
        })
      );
      return;
    }
    const txInputs = txWithdrawAllRewardsInputs(chainID);
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: `You don't have any rewards on ${capitalize(
            asset.chainName
          )} network`,
        })
      );
    }
  };

  const claimAndStake = (chainID: string) => {
    if (isAuthzMode) {
      const { address } = getChainInfo(chainID);
      const msgs = txAuthzRestakeMsgs(chainID);
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
          message: `A reStake transaction is still pending on ${capitalize(
            asset.chainName
          )} network...`,
        })
      );
      return;
    }
    const txInputs = txRestakeInputs(chainID);
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
    else
      dispatch(
        setError({
          type: 'error',
          message: `You don't have any rewards on ${capitalize(
            asset.chainName
          )} network`,
        })
      );
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
        <div className="flex gap-1" style={{ alignItems: 'flex-start' }}>
          <div className="text-sm not-italic font-normal leading-[normal]">
            {formatDollarAmount(asset.usdPrice)}
          </div>
          <div className="flex items-center">
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
                'text-sm not-italic font-normal leading-[normal] ' +
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
          {formatDollarAmount(asset.usdValue)}
        </div>
      </td>
      <td>
        <div className="flex gap-10 justify-center">
          <Tooltip
            title={asset.type === 'ibc' ? 'IBC Deposit feature is coming soon..' : 'Claim'}
            placement="top-end"
          >
            <div
              className={
                'asset-action ' + (asset.type === 'ibc' ? 'disabled' : 'active')
              }
              onClick={() => {
                if (asset.type === 'native') claim(asset.chainID);
              }}
            >
              {asset.type !== 'ibc' && txClaimStatus === TxStatus.PENDING ? (
                <CircularProgress size={16} />
              ) : (
                <Image
                  src={
                    '/' +
                    (asset.type === 'ibc' ? 'disabled-deposit.svg' : 'claim-icon.svg')
                  }
                  height={asset.type === 'ibc' ? 24 : 16}
                  width={asset.type === 'ibc' ? 24 : 16}
                  alt="Claim"
                />
              )}
            </div>
          </Tooltip>
          <Tooltip
            title={asset.type === 'ibc' ? 'IBC Withdraw feature is coming soon..' : 'Claim & Stake'}
            placement="top-start"
          >
            <div
              className={
                'asset-action ' + (asset.type === 'ibc' ? 'disabled' : 'active')
              }
              onClick={() => {
                if (asset.type === 'native') claimAndStake(asset.chainID);
              }}
            >
              {txRestakeStatus === TxStatus.PENDING && asset.type !== 'ibc' ? (
                <CircularProgress size={16} />
              ) : (
                <Image
                  src={
                    '/' +
                    (asset.type === 'ibc'
                      ? 'disabled-withdraw.svg'
                      : 'claim-stake-icon.svg')
                  }
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
