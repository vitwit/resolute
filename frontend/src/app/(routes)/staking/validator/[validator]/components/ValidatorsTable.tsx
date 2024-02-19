import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import { getTotalDelegationsCount } from '@/store/features/staking/stakeSlice';
import { ValidatorProfileInfo } from '@/types/staking';
import { copyToClipboard } from '@/utils/copyToClipboard';
import {
  capitalizeFirstLetter,
  formatCommission,
  shortenName,
} from '@/utils/util';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

const ValidatorsTable = ({
  data,
}: {
  data: Record<string, ValidatorProfileInfo>;
}) => {
  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="validators-table bg-[#1a1a1b] px-8 py-8">
        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <table className="w-full text-sm leading-normal">
              <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
                <tr className="text-left">
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Network Name
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Validator Rank
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Voting Power
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Total Delegators
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Commission
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Total Staked Assets
                    </div>
                  </th>
                  <th>
                    <div className="min-h-[17px] flex items-center text-sm not-italic font-normal leading-[normal]">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="flex-1">
                {Object.keys(data).map((chainID) => {
                  return (
                    <ValidatorItem
                      validatorInfo={data[chainID]}
                      key={chainID}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;

const ValidatorItem = ({
  validatorInfo,
}: {
  validatorInfo: ValidatorProfileInfo;
}) => {
  const {
    chainID,
    commission,
    rank,
    totalStakedInUSD,
    tokens,
    operatorAddress,
  } = validatorInfo;
  const { getChainInfo } = useGetChainInfo();
  const { chainName, chainLogo, restURLs } = getChainInfo(chainID);
  const dispatch = useAppDispatch();
  const totalDelegators = useAppSelector(
    (state) =>
      state.staking.chains[chainID].validatorProfiles?.[operatorAddress]
        ?.totalDelegators
  );

  const stakingURL = `/staking/${chainName.toLowerCase()}?validator_address=${operatorAddress}&action=delegate`;

  const totalTokens = Number(tokens);
  const votingPower = isNaN(totalTokens)
    ? '-'
    : Number(totalTokens.toFixed(0)).toLocaleString();
  const totalAssets = Number(totalStakedInUSD);
  const totalStaked = isNaN(totalAssets)
    ? '-'
    : Number(totalAssets.toFixed(0)).toLocaleString();
  const delegatorsCount = Number(totalDelegators);
  const totalDelegatorsCount = isNaN(delegatorsCount)
    ? '-'
    : Number(delegatorsCount.toFixed(0)).toLocaleString();

  useEffect(() => {
    if (operatorAddress?.length) {
      dispatch(
        getTotalDelegationsCount({
          baseURLs: restURLs,
          chainID,
          operatorAddress,
        })
      );
    }
  }, [operatorAddress]);

  return (
    <tr>
      <td>
        <NetworkItem
          logo={chainLogo}
          networkName={chainName}
          operatorAddress={operatorAddress}
        />
      </td>
      <td>{rank}</td>
      <td>{votingPower}</td>
      <td>{totalDelegatorsCount}</td>
      <td>{formatCommission(commission)}</td>
      <td>{'$ ' + totalStaked}</td>
      <td>
        <button className="primary-gradient px-3 py-[6px] w-full rounded-lg">
          <Link href={stakingURL}>Stake</Link>
        </button>
      </td>
    </tr>
  );
};

const NetworkItem = ({
  logo,
  networkName,
  operatorAddress,
}: {
  networkName: string;
  logo: string;
  operatorAddress: string;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center gap-2">
      <Image
        className="rounded-full"
        src={logo}
        width={24}
        height={24}
        alt={networkName}
      />
      {/* <div className="text-[14px]">{capitalizeFirstLetter(networkName)}</div> */}
      <Tooltip title={capitalizeFirstLetter(networkName)} placement="bottom">
        <h3 className="text-[14px] leading-normal opacity-100 w-[80px] max-w-[80px] cursor-default">
          <span>{shortenName(capitalizeFirstLetter(networkName), 10)}</span>
        </h3>
      </Tooltip>
      <Image
        className="cursor-pointer"
        onClick={(e) => {
          copyToClipboard(operatorAddress);
          dispatch(
            setError({
              type: 'success',
              message: 'Copied',
            })
          );
          e.stopPropagation();
        }}
        src="/copy.svg"
        width={24}
        height={24}
        alt="copy"
      />
    </div>
  );
};
