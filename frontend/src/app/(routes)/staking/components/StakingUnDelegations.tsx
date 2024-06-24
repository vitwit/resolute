import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
// import Image from 'next/image'
import React from 'react';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { Chains } from '@/store/features/staking/stakeSlice';
import '../staking.css';
import WithConnectionIllustration from '@/components/illustrations/withConnectionIllustration';
import ValidatorName from './ValidatorName';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

function StakingUnDelegations({
  undelegations,
  isSingleChain,
}: {
  undelegations: Chains;
  isSingleChain?: boolean;
}) {
  const staking = useStaking({ isSingleChain: true });

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  const getChainName = (chainID: string) => {
    return Object.keys(nameToChainIDs).find(key => nameToChainIDs[key] === chainID) || '-';
  }

  const cancelUnbonding = (
    chainID: string,
    delegator: string,
    validator: string,
    height: string,
    amount: number
  ) => {
    staking.txCancelUnbond(chainID, delegator, validator, amount, height);
  };

  let unbondingCount = 0;

  Object.entries(undelegations).forEach(([, value]) => {
    get(value, 'unbonding.unbonding.unbonding_responses', []).forEach((ud) => {
      unbondingCount = get(ud, 'entries.length', 0);
    });
  });

  return (
    <div className={`flex flex-col w-full mt-10 ${unbondingCount ? 'gap-10' : ''}`}>
      <div className="space-y-2 items-start">
        <div className="text-h2">Unbonding</div>
        <div className="secondary-text">
          Unbonding delegations will be locked until their locked time, after
          which they will be available in your balance.
        </div>
        <div className="horizontal-line"></div>
      </div>

      {(staking.undelegationsLoading === 0 && !unbondingCount) ||
        (isSingleChain && !unbondingCount) ? (
        <WithConnectionIllustration message="No Un Delegations" />
      ) : null}

      <div className="grid grid-cols-3 gap-10 px-6 py-0">
        {Object.entries(undelegations).map(([key, value]) => {
          return get(value, 'unbonding.unbonding.unbonding_responses', []).map(
            (ud) => {
              return get(ud, 'entries', []).map((e, kIndex) => {
                return (
                  <div key={kIndex} className="unBonding-card">
                    <div className="flex justify-between w-full">
                      <div className="flex space-x-2 justify-center items-center">
                        <ValidatorName
                          valoperAddress={get(ud, 'validator_address', '')}
                          chainID={key}
                        />
                      </div>
                      <div className="">
                        <button
                          onClick={() =>
                            cancelUnbonding(
                              key,
                              get(ud, 'delegator_address'),
                              get(ud, 'validator_address'),
                              get(e, 'creation_height'),
                              Number(get(e, 'balance'))
                            )
                          }
                          className="primary-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-small">Network</p>
                        <p className="text-b1">{getChainName(key)}</p>
                      </div>
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-small">Avail Days</p>
                        <p className="text-b1">
                          {getTimeDifferenceToFutureDate(
                            get(e, 'completion_time', '')
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-small">Amount</p>
                        <p className="text-b1">
                          {staking.getAmountWithDecimal(
                            Number(get(e, 'balance')),
                            key
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              });
            }
          );
        })}
      </div>
    </div>
  );
}

export default StakingUnDelegations;
