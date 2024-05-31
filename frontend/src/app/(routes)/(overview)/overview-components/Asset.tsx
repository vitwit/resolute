import { formatAmount, formatCoin, formatDollarAmount } from '@/utils/util';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
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
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    <tr className="table-border-line">
      <th className="px-0 py-8">
        <div className="flex flex-col items-center">
          <div className="text-white text-base not-italic font-normal leading-[normal]">
            {formatCoin(asset.balance, asset.displayDenom)}
          </div>
          <div className="flex space-x-2">
            <Image
              src={asset?.chainLogoURL}
              width={16}
              height={16}
              alt="Akash-Logo"
              loading="lazy"
            />
            <p className="text-white text-sm not-italic font-extralight leading-[normal]">
              on {' '}
              <Link href={`/overview/${asset.chainName}`}>
                {asset.chainName}
              </Link>
            </p>
          </div>
        </div>
      </th>
      <th>
        <div className="text-white text-base not-italic font-normal leading-[normal]">
          {asset.type === 'native'
            ? formatCoin(asset.staked, asset.displayDenom)
            : '-'}
        </div>
      </th>
      <th>
        <div className="text-white text-base not-italic font-normal leading-[normal]">
          {asset.type === 'native'
            ? formatCoin(asset.rewards, asset.displayDenom)
            : '-'}
        </div>
      </th>
      <th>
        <div className="flex flex-col text-red items-center">
          <div className="text-white text-base not-italic font-normal leading-[normal]">
            {formatDollarAmount(asset.usdPrice)}
          </div>
          <div className="flex">

            <Image
              src={`/${asset.inflation >= 0 ? 'up' : 'down'
                }-arrow-filled-icon.svg`}
              width={9}
              height={5}
              alt="down-arrow-filled-icon"
            />
            <div
              className={
                'text-sm not-italic font-normal leading-[normal] ' +
                (asset.inflation >= 0 ? 'text-[#238636]' : 'text-[#E57575]')
              }
            >
              <p className="text-[rgba(241,87,87,0.50)] text-sm not-italic font-extralight leading-[normal]">
                {formatAmount(Math.abs(asset.inflation))}%
              </p>
            </div>
          </div>
        </div>
      </th>
      <th>
        <div className="text-white text-base not-italic font-normal leading-[normal]">
          {formatDollarAmount(asset.usdValue)}
        </div>
      </th>
      <th>
        {/* <div className="items-center justify-center flex relative inline-block">
          <Image
            src="/more.svg"
            width={24}
            height={24}
            alt="more-icon"
            className="cursor-pointer"
            ref={buttonRef}
            onClick={togglePopup}
          />
        </div> */}

        <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={togglePopup}
            className="w-8 h-8 border-2 border-transparent rounded-full text-white flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-[0.5px]"
          >
            <div className="flex items-center justify-center w-full h-full bg-black rounded-full">
              <p className='mt-[-7px]'> ...</p>
            </div>
          </button>
          {/* <button
            ref={buttonRef}
            onClick={togglePopup}
            className="w-10 h-10 border border-white rounded-full text-white flex items-center justify-center"
          >
            . . .
          </button> */}

          {showPopup && (
            <div
              ref={popupRef}
              className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-[10%] shadow-lg"
            >
              <div className="py-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <Tooltip
                    title={asset.type === 'ibc' ? 'IBC Deposit feature is coming soon..' : 'Claim'}
                    placement="top-end"
                  >
                    <div
                      onClick={() => {
                        if (asset.type === 'native') claim(asset.chainID);
                      }}
                    >
                      {asset.type !== 'ibc' && txClaimStatus === TxStatus.PENDING ? (
                        <CircularProgress size={16} />
                      ) : (
                        'Claim'
                      )}
                    </div>
                  </Tooltip>
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <Tooltip
                    title={asset.type === 'ibc' ? 'IBC Withdraw feature is coming soon..' : 'Claim & Stake'}
                    placement="top-start"
                  >
                    <div
                      onClick={() => {
                        if (asset.type === 'native') claimAndStake(asset.chainID);
                      }}
                    >
                      {txRestakeStatus === TxStatus.PENDING && asset.type !== 'ibc' ? (
                        <CircularProgress size={16} />
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
      </td> */}
    </tr>
  );
};

export default Asset;
