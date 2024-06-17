import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { get } from 'lodash';
import CustomLoader from '@/components/common/CustomLoader';
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
} from '@/store/features/staking/stakeSlice';
import { Validator } from '@/types/staking';
import SearchValidator from '../components/SearchValidator';

interface ValStatusObj {
  [key: string]: string;
}

const valStatusObj: ValStatusObj = {
  BOND_STATUS_BONDED: 'Bonded',
  BOND_STATUS_UNBONDED: 'Unbonded',
};

const ValidatorTable: React.FC<{ chainID: string }> = ({ chainID }) => {
  const staking = useSingleStaking(chainID);
  const dispatch = useAppDispatch();
  const filteredValidators = useSelector(selectFilteredValidators);
  const searchQuery = useSelector(selectSearchQuery);

  const validators = staking.getValidators();

  useEffect(() => {
    if (validators?.status === 'idle') {
      const activeValidators = get(validators, 'active', {});
      const inactiveValidators = get(validators, 'inactive', {});
      dispatch(setValidators({ ...activeValidators, ...inactiveValidators }));
    }
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
      dispatch(filterValidators());
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
    return Object.entries(filteredValidators || {}).map(
      ([key, value], index) => (
        <React.Fragment key={key}>
          <tr className="table-border-line">
            <td className="px-0 py-8">
              <div className="mr-auto flex">
                <div className="text-white text-base font-normal leading-[normal]">
                  #{index + 1}
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
                <p className="text-white text-sm font-normal leading-[normal]">
                  {get(value, 'description.moniker')}
                </p>{' '}
                &nbsp;
                <WalletAddress
                  address={get(value, 'operator_address')}
                  displayAddress={false}
                />
              </div>
            </td>
            <td className="">
              <div className="text-white text-left text-base font-normal leading-[normal]">
                {Number(get(value, 'commission.commission_rates.rate')) * 100}%
              </div>
            </td>
            <td className="">
              <div className="text-left text-base font-normal leading-[normal]">
                {getAmountWithDecimal(Number(get(value, 'tokens')), chainID)}
              </div>
            </td>
            <td className="">
              <div className="text-left text-base font-normal leading-[normal]">
                {valStatusObj[get(value, 'status')]}
              </div>
            </td>
            <td className="">
              <button
                onClick={() => {
                  setOpenDelegate(true);
                  setSelectedValidator(value);
                }}
                className="primary-btn"
              >
                Delegate
              </button>
            </td>
          </tr>
        </React.Fragment>
      )
    );
  }, [filteredValidators, chainID]);

  return (
    <div className="flex flex-col gap-10 w-full overflow-scroll h-[50vh]">
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
          Connect your wallet now to access all the modules on resolute
        </div>
        <div className="horizontal-line"></div>
      </div>
      <div className="flex flex-col items-start gap-10 w-full px-6 py-0">
        {/* <div className="search-bar flex items-center">
          <Image src="/search.svg" width={24} height={24} alt="Search-Icon" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="text-[rgba(255,255,255,0.50)] w-full h-[37px] pl-1 text-base not-italic font-normal leading-[normal] bg-transparent border-none ml-2"
            placeholder="Search Validator"
          />
        </div> */}
        <SearchValidator
          handleSearchQueryChange={(e) => handleSearch(e.target.value)}
          searchQuery={searchQuery}
        />
        <div className="w-full flex flex-col items-start gap-2 overflow-y-scroll h-[30vh]">
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
                <CustomLoader loadingText="Loading..." />
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
