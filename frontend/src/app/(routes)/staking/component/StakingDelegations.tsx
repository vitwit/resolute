

import useStaking from '@/custom-hooks/useStaking';
import { get } from 'lodash';
import Image from 'next/image';
import React from 'react'

function StakingDelegations() {
    const staking = useStaking();

    const delegations = staking.getAllDelegations()
    return (
        <div className="flex flex-col w-full gap-10">
            <div className="space-y-2 items-start">
                <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
                    Delegations
                </div>
                <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
                    Connect your wallet now to access all the modules on resolute{' '}
                </div>
                <div className="horizontal-line"></div>
            </div>

            {
                Object.entries(delegations).map(([key, value]) => (
                    <div className="flex flex-col items-start gap-4 self-stretch px-6 py-0">
                        <div className="flex justify-between w-full">
                            <div className="flex space-x-4">
                                <div className="space-x-2 flex">
                                    <Image
                                        src="/akash-logo.svg"
                                        width={32}
                                        height={32}
                                        alt="akash-logo"
                                    />
                                    <p className="text-white text-base not-italic font-normal leading-8">
                                        {key}
                                    </p>
                                </div>
                                <div className="red-button text-white text-[10px] not-italic font-light leading-6">
                                    Total staked : 20 AKT{' '}
                                </div>
                            </div>
                            <div className="">
                                <button className="primary-btn cursor-pointer">Claim 12.4.5 AKT</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 w-full gap-4">
                            {get(value, 'delegations.delegations.delegation_responses', []).map((data, dataid) => (
                                <div key={dataid} className="delegations-card w-full">
                                    <div className="flex items-center justify-between self-stretch">
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                                Validator Name
                                            </p>
                                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                            {get(data, 'delegation.validator_address')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                                Staked Amount
                                            </p>
                                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                            {get(data, 'balance.amount')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                                Commission
                                            </p>
                                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                                Cosmostation
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }


        </div>
    )
}

export default StakingDelegations