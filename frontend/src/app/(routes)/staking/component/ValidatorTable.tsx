import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { get } from 'lodash';
import Image from 'next/image';
import { Validator } from '@/types/staking';
import CustomLoader from '@/components/common/CustomLoader';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';
import ValidatorLogo from '../components/ValidatorLogo';

interface ValStatusObj {
  [key: string]: string;
}

const valStatusObj: ValStatusObj = {
  BOND_STATUS_BONDED: 'Bonded',
  BOND_STATUS_UNBONDED: 'Un Bonded',
};

const ValidatorTable: React.FC<{ chainID: string }> = ({ chainID }) => {
  const staking = useSingleStaking(chainID);
  const validators = staking.getValidators();

  const [filteredValidators, setFilteredValidators] = useState<Record<string, Validator>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (validators?.status === 'idle') {
      const activeValidators = get(validators, 'active', {});
      const inactiveValidators = get(validators, 'inactive', {});
      setFilteredValidators({ ...activeValidators, ...inactiveValidators });
    }
  }, [validators?.status]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    const allValidators = { ...get(validators, 'active', {}), ...get(validators, 'inactive', {}) };

    if (query) {
      const foundKey = Object.keys(allValidators).find((key) =>
        allValidators[key].operator_address.includes(query) ||
        allValidators[key].description?.moniker.includes(query)
      );

      setFilteredValidators(foundKey ? { [foundKey]: allValidators[foundKey] } : allValidators);
    } else {
      setFilteredValidators(allValidators);
    }
  }, [validators]);

  const validatorRows = useMemo(() => {
    return Object.entries(filteredValidators || {}).map(([key, value], index) => (
      <tr key={key} className="table-border-line">
        <td className="px-0 py-8">
          <div className="mr-auto flex">
            <div className="text-white text-base not-italic font-normal leading-[normal]">
              #{index + 1}
            </div>
          </div>
        </td>
        <td className="">
          <div className="flex space-x-2">
            <ValidatorLogo
              width={20}
              height={20}
              identity={get(value, 'description.identity', '')}
            /> &nbsp;

            {/* Validator name  */}
            <p className="text-white text-sm not-italic font-normal leading-[normal]">
              {get(value, 'description.moniker')}
            </p> &nbsp;

            {/* Copy address icon */}
            <WalletAddress address={get(value, 'operator_address')} displayAddress={false} />
          </div>
        </td>
        <td className="">
          <div className="text-white text-left text-base not-italic font-normal leading-[normal]">
            {Number(get(value, 'commission.commission_rates.rate')) * 100}%
          </div>
        </td>
        <td className="">
          <div className="text-white text-left text-base not-italic font-normal leading-[normal]">
            {staking.getAmountWithDecimal(Number(get(value, 'tokens')), chainID)}
          </div>
        </td>
        <td className="">
          <div className="text-white text-left text-base not-italic font-normal leading-[normal]">
            {valStatusObj[get(value, 'status')]}
          </div>
        </td>
        <td className="">
          <div className="text-white text-base not-italic font-normal leading-[normal] ">
            <button className="custom-btn ">Delegate</button>
          </div>
        </td>
      </tr>
    ));
  }, [filteredValidators, chainID, staking]);

  return (
    <div className="flex flex-col gap-10 self-stretch overflow-scroll h-[50vh] px-10">
      <div className="space-y-1">
        <div className="text-white text-lg not-italic font-normal leading-[27px]]">
          Validators
        </div>
        <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-[21px]">
          Connect your wallet now to access all the modules on resolute
        </div>
        <div className="horizontal-line"></div>
      </div>
      <div className="flex flex-col items-start gap-10 self-stretch px-6 py-0">
        <div className="search-bar">
          <Image src="/search.svg" width={24} height={24} alt="Search-Icon" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal] bg-transparent border-none"
            placeholder=" Search Validator"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-2 self-stretch overflow-y-scroll h-[30vh]">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                <th className="w-1/6">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base not-italic font-normal leading-[normal]">
                    Rank
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base not-italic font-normal leading-[normal]">
                    Validator
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base not-italic font-normal leading-[normal]">
                    Commission
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base not-italic font-normal leading-[normal]">
                    Voting Power
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-left text-base not-italic font-normal leading-[normal]">
                    Status
                  </div>
                </th>
                <th className="w-1/6">
                  <div></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {validators?.status === 'pending' ? <CustomLoader loadingText='Loading...' /> : validatorRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ValidatorTable;