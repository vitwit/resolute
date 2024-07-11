import { formatAmount, formatCoin, formatDollarAmount } from '@/utils/util';
import Link from 'next/link';
import React, { RefObject, useEffect, useRef, useState } from 'react';
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
  // showChainName,
}: {
  asset: ParsedAsset;
  // showChainName: boolean;
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

  // actions for claim and claim and stake

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef: RefObject<HTMLImageElement> = useRef<HTMLImageElement>(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <tr className="hover:bg-[#FFFFFF14] space-y-2">
      <th className=" px-4 py-4 w-1/4">
        <div className="flex flex-col items-start gap-1">
          <div className="text-[14px] font-normal leading-[21px]">
            {formatCoin(asset.balance, asset.displayDenom).split('.')[0]}.
            <span className="text-[12px]">
              {
                formatCoin(asset.balance, asset.displayDenom)
                  ?.split('.')[1]
                  ?.split(' ')[0]
              }
            </span>
            {' ' +
              formatCoin(asset.balance, asset.displayDenom)
                ?.split('.')[1]
                ?.split(' ')[1]}
          </div>
          <div className="flex space-x-1 justify-center items-center">
            <Image
              src={asset?.chainLogoURL}
              width={16}
              height={16}
              alt="chain-Logo"
              loading="lazy"
              className="w-4 h-4"
              draggable={false}
            />
            <p className="text-small">
              on{' '}
              <Link
                className="capitalize"
                href={`/overview/${asset.chainName}`}
              >
                {asset.chainName}
              </Link>
            </p>
          </div>
        </div>
      </th>
      <th>
        <div className="flex flex-col items-start gap-2">
          <div className="text-[14px] font-normal leading-[normal] items-start flex">
            {asset.type === 'native' ? (
              <span>
                {formatCoin(asset.staked, asset.displayDenom).split('.')[0]}
                <span className="text-[12px]">
                  {Number(
                    formatCoin(asset.staked, asset.displayDenom).split(' ')[0]
                  ) === 0
                    ? ''
                    : '.'}
                  {
                    formatCoin(asset.staked, asset.displayDenom)
                      ?.split('.')[1]
                      ?.split(' ')[0]
                  }{' '}
                  {
                    formatCoin(asset.staked, asset.displayDenom)
                      ?.split('.')[1]
                      ?.split(' ')[1]
                  }
                </span>
              </span>
            ) : (
              '-'
            )}
          </div>

          <div className="w-4 h-4" />
        </div>
      </th>
      <th>
        <div className="flex flex-col items-start gap-2">
          <div className="text-[14px] font-normal leading-[normal] items-start flex">
            {asset.type === 'native' ? (
              <span>
                {formatCoin(asset.rewards, asset.displayDenom).split('.')[0]}
                <span className="text-[12px]">
                  {Number(
                    formatCoin(asset.rewards, asset.displayDenom).split(' ')[0]
                  ) == 0
                    ? ' '
                    : '.'}
                  {
                    formatCoin(asset.rewards, asset.displayDenom)
                      ?.split('.')[1]
                      ?.split(' ')[0]
                  }{' '}
                  {
                    formatCoin(asset.rewards, asset.displayDenom)
                      ?.split('.')[1]
                      ?.split(' ')[1]
                  }
                </span>
              </span>
            ) : (
              '-'
            )}
          </div>
          <div className="w-4 h-4" />
        </div>
      </th>
      <th>
        <div className="flex flex-col items-start gap-2">
          <div className="text-[14px] font-normal leading-[normal] flex items-baseline">
            {formatDollarAmount(asset.usdPrice).split('.')[0]}.
            <span className="text-[12px]">
              {formatDollarAmount(asset.usdPrice).split('.')[1]}
            </span>
          </div>
          <div className="flex">
            <div
              className={
                'text-sm font-normal leading-[normal] ' +
                (asset.inflation >= 0 ? 'text-[#238636]' : 'text-[#F1575780]')
              }
            >
              <p className="text-sm font-extralight leading-[normal]">
                {formatAmount(Math.abs(asset.inflation)).split('.')[0]}.
                <span className="text-[12px]">
                  {' '}
                  {formatAmount(Math.abs(asset.inflation)).split('.')[1]}
                </span>
               {' '} %
              </p>
            </div>
            <Image
              src={`/${
                asset.inflation >= 0 ? 'up' : 'down'
              }-arrow-filled-icon.svg`}
              width={18}
              height={5}
              alt="down-arrow-filled-icon"
            />
          </div>
        </div>
      </th>
      {/* <th>
        <div className="flex flex-col items-start gap-2">
          <div className="text-base font-normal flex">
            {formatDollarAmount(asset.usdValue).split('.')[0]}.
            <span >
              {formatDollarAmount(asset.usdValue).split('.')[1]}
            </span>
          </div>
          <div className="w-4 h-4" />
        </div>
      </th> */}
      <th className="">
        <div className="items-center justify-center relative inline-block">
          <Image
            src="/more.svg"
            width={24}
            height={24}
            alt="more-icon"
            className="cursor-pointer"
            ref={buttonRef}
            onClick={togglePopup}
          />

          {showPopup && (
            <div
              ref={popupRef}
              className="absolute right-0 z-10 more-popup-grid"
            >
              <div className="w-full">
                <a
                  href="#"
                  className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10] rounded-t-2xl"
                  onClick={() => {
                    if (asset.type === 'native') claim(asset.chainID);
                  }}
                >
                  <Tooltip
                    title={
                      asset.type === 'ibc'
                        ? 'IBC Deposit feature is coming soon..'
                        : 'Claim'
                    }
                    placement="top-end"
                  >
                    <div>
                      {asset.type !== 'ibc' &&
                      txClaimStatus === TxStatus.PENDING ? (
                        <>
                          {' '}
                          Claiming.... <CircularProgress size={16} />
                        </>
                      ) : (
                        'Claim'
                      )}
                    </div>
                  </Tooltip>
                </a>
                <a
                  href="#"
                  className="flex items-center w-full p-4 text-b1 hover:bg-[#FFFFFF10] rounded-b-2xl"
                  onClick={() => {
                    if (asset.type === 'native') claimAndStake(asset.chainID);
                  }}
                >
                  <Tooltip
                    title={
                      asset.type === 'ibc'
                        ? 'IBC Withdraw feature is coming soon..'
                        : 'Claim & Stake'
                    }
                    placement="top-start"
                  >
                    <div>
                      {txRestakeStatus === TxStatus.PENDING &&
                      asset.type !== 'ibc' ? (
                        <>
                          Claiming and staking...
                          <CircularProgress size={16} />
                        </>
                      ) : (
                        'Claim And Stake'
                      )}
                    </div>
                  </Tooltip>
                </a>
              </div>
            </div>
          )}
        </div>
      </th>
      {/* <td>
        <div className="flex gap-10 justify-center">
          <Tooltip
            title={asset.type === 'ibc' ? 'IBC Deposit feature is coming soon..' : 'Claim'}
	@@ -243,7 +370,7 @@ const Asset = ({
            </div>
          </Tooltip>
        </div>
      </td> */}
    </tr>
  );
};
export default Asset;