import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { get } from 'lodash';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';
import ValidatorLogo from '../components/ValidatorLogo';
import DelegatePopup from '../components/DelegatePopup';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { useSelector } from 'react-redux';
import {
  selectFilteredValidators,
  selectSearchQuery,
} from '../selectors/validatorsSelectors';
import {
  filterValidators,
  setSearchQuery,
  setValidators,
  sortValidatorsByVotingPower,
} from '@/store/features/staking/stakeSlice';
import { Validator } from '@/types/staking';
import SearchValidator from '../components/SearchValidator';
import { shortenName } from '@/utils/util';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import NumberFormat from '@/components/common/NumberFormat';
import Link from 'next/link';

interface ValStatusObj {
  [key: string]: string;
}

const valStatusObj: ValStatusObj = {
  BOND_STATUS_BONDED: 'Active',
  BOND_STATUS_UNBONDED: 'Unbonded',
  BOND_STATUS_UNBONDING: 'Unbonding',
};

const ValidatorTable: React.FC<{ chainID: string }> = ({ chainID }) => {
  const router = useRouter();
  const { getChainInfo } = useGetChainInfo();
  const { chainName } = getChainInfo(chainID);
  const staking = useSingleStaking(chainID);
  const dispatch = useAppDispatch();
  const filteredValidators = useSelector(selectFilteredValidators);
  const searchQuery = useSelector(selectSearchQuery);

  const validators = staking.getValidators();

  const paramValidatorAddress = useSearchParams().get('validator_address');
  const paramAction = useSearchParams().get('action');

  useEffect(() => {
    if (validators?.status === 'idle') {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const activeValidators: any = get(validators, 'active', {});

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const inactiveValidators: any = get(validators, 'inactive', {});

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const activeSsortedObj: any = {};
      let rank = 1;
      get(validators, 'activeSorted', []).forEach((key) => {
        if (activeValidators.hasOwnProperty(key)) {
          activeSsortedObj[key] = {
            rank: rank++,
            ...activeValidators[key],
          };
        }
      });

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const inactiveSsortedObj: any = {};

      get(validators, 'inactiveSorted', []).forEach((key) => {
        if (inactiveValidators.hasOwnProperty(key)) {
          inactiveSsortedObj[key] = {
            rank: rank++,
            ...inactiveValidators[key],
          };
        }
      });

      dispatch(setValidators({ ...activeSsortedObj, ...inactiveSsortedObj }));
    }
  }, [validators?.status]);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
      dispatch(filterValidators());
      dispatch(sortValidatorsByVotingPower({ chainID }));
    },
    [dispatch]
  );

  const { getAmountWithDecimal } = useSingleStaking(chainID);
  const [openDelegate, setOpenDelegate] = useState<boolean>(false);
  const [selectedValidator, setSelectedValidator] = useState<string>('');
  const [selectValCommission, setSelectValCommission] = useState<number>(0);

  const validatorRows = useMemo(() => {
    return Object.entries(filteredValidators || {}).map(([key, value]) => (
      <React.Fragment key={key}>
        <tr className="">
          <td className="px-0 py-4">
            <div className="mr-auto flex">
              <div className="text-b1"># {get(value, 'rank', '-')}</div>
            </div>
          </td>
          <td className="">
            <div className="flex space-x-1 items-center">
              <ValidatorLogo
                width={20}
                height={20}
                identity={get(value, 'description.identity', '')}
              />{' '}
              &nbsp;
              <Link
                href={
                  get(value, 'description.moniker', '')
                    ? `/validator/${encodeURIComponent(get(value, 'description.moniker', ''))}`
                    : ''
                }
              >
                <p className="text-b1">
                  {shortenName(get(value, 'description.moniker', ''), 12)}
                </p>{' '}
              </Link>
              &nbsp;
              <WalletAddress
                address={get(value, 'operator_address')}
                displayAddress={false}
              />
            </div>
          </td>
          <td className="">
            <div className="text-left text-b1">
              {parseInt(
                (
                  get(value, 'commission.commission_rates.rate') * 100
                ).toString()
              )}
              %
            </div>
          </td>
          <td className="">
            <div className="text-left text-b1">
              <NumberFormat
                value={getAmountWithDecimal(
                  Number(get(value, 'tokens')),
                  chainID
                )}
                cls=""
                type="token"
                token={''}
              />

              {/* {getAmountWithDecimal(Number(get(value, 'tokens')), chainID)} */}
            </div>
          </td>
          <td className="">
            <div className="text-left text-b1">
              {get(value, 'jailed')
                ? 'Jailed'
                : valStatusObj[get(value, 'status')]}
            </div>
          </td>
          <td className="">
            {!get(value, 'jailed') ? (
              <button
                onClick={() => {
                  setOpenDelegate(true);
                  handleOpenDelegateDialog(value);
                }}
                className="primary-btn"
              >
                Delegate
              </button>
            ) : null}
          </td>
        </tr>
      </React.Fragment>
    ));
  }, [filteredValidators, chainID]);

  const handleOpenDelegateDialog = (validator: Validator) => {
    setSelectedValidator(validator.operator_address);
    const c = parseInt(get(validator, 'commission.commission_rates.rate'))*100
    setSelectValCommission(c)
    router.push(
      `?validator_address=${validator.operator_address}&action=delegate`
    );
  };

  const handleCloseDelegateDialog = () => {
    setSelectedValidator('');
    router.push(`/staking/${chainName.toLowerCase()}`);
    setOpenDelegate(false);
  };

  useEffect(() => {
    if (
      paramValidatorAddress?.length &&
      paramAction?.length &&
      filteredValidators
    ) {
      if (paramAction.toLowerCase() === 'delegate') {
        setSelectedValidator(paramValidatorAddress);
        setOpenDelegate(true);
      }
    }
  }, [paramValidatorAddress, paramAction, filteredValidators]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {openDelegate ? (
        <DelegatePopup
          commission={selectValCommission}
          validator={selectedValidator || ''}
          chainID={chainID}
          onClose={handleCloseDelegateDialog}
          openPopup={openDelegate}
        />
      ) : null}

      <div className="">
        <div className="text-h2 mb-1">Validators</div>
        <div className="secondary-text mb-2">
          List of the validators in the network, including their voting power,
          performance metrics and other details
        </div>
        <div className="horizontal-line"></div>
      </div>
      <div className="flex flex-col items-start gap-6 w-full px-6 py-0">
        <SearchValidator
          handleSearchQueryChange={(e) => handleSearch(e.target.value)}
          searchQuery={searchQuery}
        />
        <div className="w-full flex flex-col items-start gap-2">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                <th className="w-1/6">
                  <div className="secondary-text text-left ">Rank</div>
                </th>
                <th className="w-1/5">
                  <div className="secondary-text text-left">Validator</div>
                </th>
                <th className="w-1/5">
                  <div className="secondary-text text-left">Commission</div>
                </th>
                <th className="w-1/5">
                  <div className="secondary-text text-left">Voting Power</div>
                </th>
                <th className="w-1/5">
                  <div className="secondary-text text-left">Status</div>
                </th>
                <th className="w-1/6">
                  <div></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {validators?.status === 'pending' ? (
                <>
                  {Array(3)
                    .fill(null)
                    .map((_, colIndex) => (
                      <tr key={colIndex} className=" animate-pulse  w-full">
                        {Array(6)
                          .fill(null)
                          .map((_, colIndex) => (
                            <td key={colIndex}>
                              <div className="h-10 bg-[#252525]  rounded my-6 mx-1"></div>
                            </td>
                          ))}
                      </tr>
                    ))}
                </>
              ) : (
                validatorRows
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ValidatorTable;
