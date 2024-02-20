import { ValidatorProfileInfo } from '@/types/staking';
import React from 'react';
import ValidatorItem from './ValidatorItem';
import TableHeader from './TableHeader';
import NetworkItem from './NetworkItem';
import useGetValidatorInfo from '@/custom-hooks/useGetValidatorInfo';
import { POLYGON_CONFIG } from '@/utils/constants';
import { formatCommission, formatValidatorStatsValue } from '@/utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import Link from 'next/link';
import { Tooltip } from '@mui/material';

const ValidatorsTable = ({
  data,
  isWitval,
}: {
  data: Record<string, ValidatorProfileInfo>;
  isWitval: boolean;
}) => {
  const columnTitles = [
    'Network Name',
    'Validator Rank',
    'Voting Power',
    'Total Delegators',
    'Commission',
    'Total Staked Assets',
    'Actions',
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-scroll">
      <div className="validators-table bg-[#1a1a1b] px-8 py-8">
        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <table className="w-full text-sm leading-normal">
              <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
                <tr className="text-left">
                  {columnTitles.map((title) => (
                    <TableHeader key={title} title={title} />
                  ))}
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
                {isWitval ? <NonCosmosValidators /> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsTable;

const NonCosmosValidators = () => {
  const { getPolygonValidatorInfo } = useGetValidatorInfo();
  const {
    commission,
    totalDelegators,
    totalStakedInUSD,
    totalStakedTokens,
    operatorAddress,
  } = getPolygonValidatorInfo();
  const totalStaked = formatValidatorStatsValue(totalStakedInUSD.toString(), 0);
  const votingPower = formatValidatorStatsValue(
    totalStakedTokens.toString(),
    0
  );
  const { logo, witvalProfile } = POLYGON_CONFIG;
  const connected = useAppSelector((state) => state.wallet.connected);

  return (
    <tr>
      <td>
        <NetworkItem
          logo={logo}
          networkName={'Polygon'}
          operatorAddress={operatorAddress}
        />
      </td>
      <td>{'-'}</td>
      <td>{votingPower || '-'}</td>
      <td>{totalDelegators !== 0 ? totalDelegators.toLocaleString() : '-'}</td>
      <td>{formatCommission(Number(commission))}</td>
      <td>{totalStaked !== '0' ? '$ ' + totalStaked : '$ -'}</td>
      <td>
        {connected ? (
          <Link href={witvalProfile} target="_blank">
            <button className="stake-btn primary-gradient">Stake</button>
          </Link>
        ) : (
          <Tooltip title="Connect wallet to stake">
            <button className="stake-btn button-disabled">Stake</button>
          </Tooltip>
        )}
      </td>
    </tr>
  );
};
