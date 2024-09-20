import { ValidatorProfileInfo } from '@/types/staking';
import React from 'react';
import ValidatorItem from './ValidatorItem';
import NetworkItem from './NetworkItem';
import useGetValidatorInfo from '@/custom-hooks/useGetValidatorInfo';
import { OASIS_CONFIG, POLYGON_CONFIG } from '@/utils/constants';
import { formatCommission, formatValidatorStatsValue } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import Link from 'next/link';
import { Tooltip } from '@mui/material';
import TableHeader from './TableHeader';
import ValidatorsLoading from './ValidatorsLoading';

const ValidatorsTable = ({
  data,
  isWitval,
}: {
  data: Record<string, ValidatorProfileInfo>;
  isWitval: boolean;
}) => {
  const columnTitles = [
    'Network',
    'Voting Power',
    'Total Delegators',
    'Commission',
    'Total Staked Assets',
    'Actions',
  ];

  const sortedKeys = Object.keys(data).sort((a, b) => {
    return (
      parseInt(data[b].totalStakedInUSD) - parseInt(data[a].totalStakedInUSD)
    );
  });

  const sortedObject: Record<string, ValidatorProfileInfo> = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = data[key];
  });

  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="validators-table">
        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <table className="w-full text-sm leading-normal">
              <thead className="relative">
                <tr className="text-left">
                  {columnTitles.map((title) => (
                    <TableHeader key={title} title={title} />
                  ))}
                </tr>
              </thead>
              <tbody className="flex-1">
                {isWitval ? (
                  <>
                    <NonCosmosValidators networkName={'polygon'} />
                    <NonCosmosValidators networkName={'oasis'} />
                  </>
                ) : null}
                {Object.keys(sortedObject).map((chainID) => {
                  return (
                    <ValidatorItem
                      validatorInfo={data[chainID]}
                      key={chainID}
                    />
                  );
                })}
              </tbody>
            </table>
            <ValidatorsLoading />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;

const NonCosmosValidators = ({ networkName }: { networkName: string }) => {
  const { getPolygonValidatorInfo, getOasisValidatorInfo } =
    useGetValidatorInfo();
  const {
    commission,
    totalDelegators,
    totalStakedInUSD,
    totalStakedTokens,
    operatorAddress,
  } =
    networkName === 'polygon'
      ? getPolygonValidatorInfo()
      : getOasisValidatorInfo();
  const totalStaked = formatValidatorStatsValue(totalStakedInUSD.toString(), 0);
  const votingPower = formatValidatorStatsValue(
    totalStakedTokens.toString(),
    0
  );
  const { logo, witval } =
    networkName === 'polygon' ? POLYGON_CONFIG : OASIS_CONFIG;
  const connected = useAppSelector((state) => state.wallet.connected);

  return (
    <tr className="hover:bg-[#FFFFFF14]">
      <td>
        <NetworkItem
          logo={logo}
          networkName={networkName}
          operatorAddress={operatorAddress}
        />
      </td>
      <td>{votingPower || '-'}</td>
      <td>{totalDelegators !== 0 ? totalDelegators.toLocaleString() : '-'}</td>
      <td>{formatCommission(Number(commission))}</td>
      <td>{totalStaked !== '0' ? '$ ' + totalStaked : '$ -'}</td>
      <td>
        {connected ? (
          <Link href={witval.profile} target="_blank">
            <button className="primary-btn">Stake</button>
          </Link>
        ) : (
          <Tooltip title="Connect wallet to stake">
            <button className="primary-btn">Stake</button>
          </Tooltip>
        )}
      </td>
    </tr>
  );
};
