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
  const [selectedValidator, setSelectedValidator] = useState<Validator>();

  const toggleDelegatePopup = useCallback(() => {
    console.log({ openDelegate });
    setOpenDelegate((prev) => !prev);
  }, []);

  const validatorRows = useMemo(() => {
    return Object.entries(filteredValidators || {}).map(([key, value]) => (
      <React.Fragment key={key}>
        <tr className="table-border-line">
          <td className="px-0 py-8">
            <div className="mr-auto flex">
              <div className="text-base font-normal leading-[normal]">
                # {get(value, 'rank', '-')}
              </div>
            </div>
          </td>
          <td className="">
            <div className="flex space-x-2 items-center">
              <ValidatorLogo
                width={20}
                height={20}
                identity={get(value, 'description.identity', '')}
              />{' '}
              &nbsp;
              <p className="text-sm font-normal leading-[normal]">
                {shortenName(get(value, 'description.moniker', ''), 12)}
              </p>{' '}
              &nbsp;
              <WalletAddress
                address={get(value, 'operator_address')}
                displayAddress={false}
              />
            </div>
          </td>
          <td className="">
            <div className="text-left text-base font-normal leading-[normal]">
              {parseInt(
                (
                  get(value, 'commission.commission_rates.rate') * 100
                ).toString()
              )}
              %
            </div>
          </td>
          <td className="">
            <div className="text-left text-base font-normal leading-[normal]">
              {getAmountWithDecimal(Number(get(value, 'tokens')), chainID)}
            </div>
          </td>
          <td className="">
            <div className="text-left text-base font-normal leading-[normal]">
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
    setSelectedValidator(validator);
    router.push(
      `?validator_address=${validator.operator_address}&action=delegate`
    );
  };

  const handleCloseDelegateDialog = (validator: Validator) => {
    setSelectedValidator(undefined);
    router.push(`/staking/${chainName.toLowerCase()}`);
  };

  useEffect(() => {
    if (paramValidatorAddress?.length && paramAction?.length) {
      if (paramAction.toLowerCase() === 'delegate') {
        const validatorInfo = filteredValidators?.[paramValidatorAddress];
        setSelectedValidator(validatorInfo);
        if (validatorInfo) {
          toggleDelegatePopup();
        }
      }
    }
  }, [paramValidatorAddress, paramAction]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {openDelegate ? (
        <DelegatePopup
          validator={selectedValidator?.operator_address || ''}
          chainID={chainID}
          openDelegatePopup={toggleDelegatePopup}
          openPopup={openDelegate}
        />
      ) : null}

      <div className="space-y-1">
        <div className="text-h2">Validators</div>
        <div className="secondary-text">
          List of the validators in the network.
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
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base font-normal leading-[normal]">
                    Rank
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base font-normal leading-[normal]">
                    Validator
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base font-normal leading-[normal]">
                    Commission
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base font-normal leading-[normal]">
                    Voting Power
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base font-normal leading-[normal]">
                    Status
                  </div>
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
