import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import Image from 'next/image';
import React from 'react';
import ValidatorName from './ValidatorName';
import useValidator from '@/custom-hooks/useValidator';
import { Chains } from '@/store/features/staking/stakeSlice';

function StakingDelegations({ delegations }: { delegations: Chains }) {
  const staking = useStaking();

  const validator = useValidator();

  const getCommisionRate = (valAddress: string, chainID: string) => {
    const v = validator.getValidatorDetails(valAddress, chainID);
    return Number(get(v, 'commission.commission_rates.rate', 0)) * 100;
  };

  const getChainTotalRewards = (chainID: string) => {
    return staking.chainTotalRewards(chainID);
  };

  const withClaimRewards = (chainID: string) => {
    staking.txWithdrawCliamRewards(chainID)
  }

  const claimTxStatus = staking.getClaimTxStatus()

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="space-y-2 items-start">
        <div className="text-h2">Delegations</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on resolute{' '}
        </div>
        <div className="horizontal-line"></div>
      </div>

      {Object.entries(delegations).map(([key, value], index) => {
        return (
          get(value, 'delegations.delegations.delegation_responses.length') && (
            <div key={index} className="px-6 py-0">
              <div className="flex justify-between w-full mb-4">
                <div className="flex space-x-4">
                  <div className="space-x-2 flex justify-center items-center">
                    <Image
                      src={staking.chainLogo(key)}
                      width={32}
                      height={32}
                      className="h-8 w-8"
                      alt="akash-logo"
                    />
                    <p className="text-white text-base font-normal leading-8 flex justify-center items-center">
                      {key}
                    </p>
                  </div>
                  <div className="staked-amount-red-badge text-white text-[10px] font-light leading-6">
                    Total staked : &nbsp;
                    {staking.getAmountWithDecimal(
                      Number(get(value, 'delegations.totalStaked', 0)),
                      key
                    )}
                  </div>
                </div>
                <div className="">
                  <button onClick={() => withClaimRewards(key)} className="primary-btn">
                    {
                      claimTxStatus[key]?.tx?.status === 'pending' ? 'loading....' :
                        <>Claim &nbsp;
                          {getChainTotalRewards(key)}
                          <p className="ml-2 text-small-light">Rewards</p></>
                    }
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 w-full gap-4">
                {get(
                  value,
                  'delegations.delegations.delegation_responses',
                  []
                ).map((data, dataid) => (
                  <div key={dataid} className="delegations-card w-full">
                    <div className="flex items-center justify-between w-full gap-10">
                      <div className="flex flex-col items-start gap-2 w-1/3">
                        <p className="text-small">Validator Name</p>
                        <ValidatorName
                          valoperAddress={get(
                            data,
                            'delegation.validator_address'
                          )}
                          chainID={key}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2 w-1/4">
                        <p className="text-small">Staked Amount</p>
                        <p className="text-b1">
                          {staking.getAmountWithDecimal(
                            Number(get(data, 'balance.amount')),
                            key
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2 w-1/4">
                        <p className="text-small">Rewards</p>
                        <p className="text-b1">0.9876 AKT</p>
                      </div>
                      <div className="flex flex-col items-start gap-2 w-1/4">
                        <p className="text-small">Commission</p>
                        <p className="text-b1">
                          {getCommisionRate(
                            get(data, 'delegation.validator_address'),
                            key
                          )}{' '}
                          %
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Image
                          src="/more.svg"
                          width={24}
                          height={24}
                          alt="More-Icon"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) || null
        );
      })}
    </div>
  );
}

export default StakingDelegations;
