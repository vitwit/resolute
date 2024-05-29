import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
// import Image from 'next/image'
import React from 'react'
import ValidatorName from './ValidatorName';
import { getTimeDifferenceToFutureDate } from '@/utils/dataTime';
import { Chains } from '@/store/features/staking/stakeSlice';

function StakingUnDelegations({undelegations }: {  undelegations: Chains }) {

    const staking = useStaking()

    return (
        <div className="flex flex-col w-full gap-10">
            <div className="space-y-2 items-start">
                <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
                    Unbonding
                </div>
                <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
                    Connect your wallet now to access all the modules on resolute{' '}
                </div>
                <div className="horizontal-line"></div>
            </div>
            <div className="grid grid-cols-3 gap-10 px-6 py-0">
                {
                    Object.entries(undelegations).map(([key, value]) => {
                        return get(value, 'unbonding.unbonding.unbonding_responses', []).map((ud, index) => {
                            return get(ud, 'entries', []).map((e) => {
                                return <div key={index} className="cards">
                                    <div className="flex items-start justify-between self-stretch">
                                        <div className="flex space-x-2">
                                            <ValidatorName valoperAddress={get(ud, 'validator_address', '')} chainID={key} />
                                        </div>
                                        <div className="">
                                            <button className="custom-btn text-white text-center text-sm not-italic font-light leading-[normal]">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between self-stretch">
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                                Network
                                            </p>
                                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                                {key}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                                Avail Days
                                            </p>
                                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                                {
                                                    getTimeDifferenceToFutureDate(get(e, 'completion_time', ''))
                                                }
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                                Amount
                                            </p>
                                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                                {staking.getAmountWithDecimal(Number(get(e, 'balance')), key)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                            )

                        })
                    })
                }



            </div>
        </div>
    )
}

export default StakingUnDelegations