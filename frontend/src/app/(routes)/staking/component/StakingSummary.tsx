import Image from 'next/image';
import React from 'react'

type AssetSummary = { icon: string; alt: string; type: string; amount: number };

function StakingSummary({
    stakedAmount, rewardsAmount, unstakeAmount, availableAmount
}: {stakedAmount: number, rewardsAmount: number, unstakeAmount: number, availableAmount: number}) {
    const assetsSummaryData: AssetSummary[] = [
        {
            icon: '/stakedamount.png',
            alt: 'stake',
            type: 'Staked Amount',
            amount:  stakedAmount,
        },
        {
            icon: '/rewards.png',
            alt: 'rewards',
            type: 'Rewards',
            amount: rewardsAmount,
        },
        {
            icon: '/avbal.png',
            alt: 'available',
            type: 'Available',
            amount: availableAmount,
        },
        {
            icon: '/unbonding.png',
            alt: 'unbonding',
            type: 'Unbonding',
            amount: unstakeAmount
            // amount: parseInt(stakedBal)+rewardsBal+availableBal,
        },
    ];

    return (
        <div className="flex gap-6 self-stretch px-6 py-0">
            <div className="grid grid-cols-4 gap-4 w-full">
                {assetsSummaryData.map((data, index) => (
                    <div key={index} className="dashboard-card">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-center">
                                <Image
                                    src={data.icon}
                                    width={60}
                                    height={40}
                                    alt={data.alt}
                                />
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="text-white text-xl not-italic font-bold leading-[18px]">
                                   $ {data?.amount?.toFixed(3)}
                                </div>
                                <div className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-light leading-[18px]">
                                    {data.type}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StakingSummary