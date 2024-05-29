import useSingleStaking from '@/custom-hooks/useSingleStaking';
import { get } from 'lodash';
import Image from 'next/image';
import {  useState } from 'react';
import ValidatorName from './ValidatorName';
import { Validator } from '@/types/staking';

interface ValStatusObj {
  [key: string]: string;
}

const valStatusObj: ValStatusObj = {
  BOND_STATUS_BONDED: 'Bonded',
  BOND_STATUS_UNBONDED: 'Un Bonded'
}

const ValidatorTable = ({ chainID }: { chainID: string }) => {
  const staking = useSingleStaking(chainID)
  const validators = staking.getValidators()

  const [validatorsArr, setValidators] = useState<Record<string, Validator>>(get(validators, 'active'));
  const [searchQuery, setSearchQuery] = useState<string>('');



  const search = (query: string) => {
    const vals = get(validators, 'active')
    console.log({ values: Object.values(validators) })

    if (query) {
      const foundKey = Object.keys(vals).find(key =>
        vals[key].operator_address.includes(query)||
        (vals[key].description && vals[key].description.moniker.includes(query))
      );

      if (foundKey) {
        setValidators({ [foundKey]: vals[foundKey] });
      } else {
        setValidators(vals);
      }
    } else {
      setValidators(vals)
    }



    // let obj[found?.operator_address] = found
    // setValidators({obj});
  };

  console.log({ validatorsArr, validators })

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
            onChange={(e) => {
              setSearchQuery(e.target.value)
              search(e.target.value)
            }}
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
              {Object.entries(validatorsArr || {}).map(([key, value], index) => (
                <tr key={key} className="table-border-line">
                  <th className="px-0 py-8">
                    <div className="mr-auto flex">
                      <div className="text-white text-base not-italic font-normal leading-[normal]">
                        #{index + 1}
                      </div>
                    </div>
                  </th>
                  <th className="">
                    <div className="flex space-x-2">
                      <ValidatorName valoperAddress={key} chainID={chainID} />
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-left text-base not-italic font-normal leading-[normal]">
                      {Number(get(value, 'commission.commission_rates.rate')) * 100}  %
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-left text-base not-italic font-normal leading-[normal]">
                      {staking.getAmountWithDecimal(Number(get(value, 'tokens')), chainID)}
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-left text-base not-italic font-normal leading-[normal]">
                      {valStatusObj[get(value, 'status')]}
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-base not-italic font-normal leading-[normal] ">
                      <button className="custom-btn ">Delegate</button>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ValidatorTable;
