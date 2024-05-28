import Image from 'next/image'
import React from 'react'

function StakingUnDelegations() {
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
                {[1, 2, 3].map((data, dataid) => (
                    <div key={dataid} className="cards">
                        <div className="flex items-start justify-between self-stretch">
                            <div className="flex space-x-2">
                                <Image
                                    src="/cosmostation.png"
                                    width={24}
                                    height={24}
                                    alt="cosmostation-logo"
                                />
                                <p className="text-white text-base not-italic font-normal leading-[normal]">
                                    Cosmostation
                                </p>
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
                                    Akash
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                    Avail Days
                                </p>
                                <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                    21 Days
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                                    Amount
                                </p>
                                <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                    0.9876 AKT
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StakingUnDelegations