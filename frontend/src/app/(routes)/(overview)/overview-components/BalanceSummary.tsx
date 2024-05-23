import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
import useGetAuthzAssetsAmount from '../../../../custom-hooks/useGetAuthzAssetsAmount';
type AssetSummary = { icon: string; alt: string; type: string; amount: string };

export default function BalanceSummary({ chainIDs }: { chainIDs: string[] }) {
    const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
    const [myStaked, myAvailable, myRewards] = useGetAssetsAmount(chainIDs);
    const [authzStaked, authzAvailable, authzRewards] =
        useGetAuthzAssetsAmount(chainIDs);

    const stakedAmount = isAuthzMode ? authzStaked : myStaked;
    const availableAmount = isAuthzMode ? authzAvailable : myAvailable;
    const rewardsAmount = isAuthzMode ? authzRewards : myRewards;

    const available = formatDollarAmount(availableAmount);
    const staked = formatDollarAmount(stakedAmount);
    const rewards = formatDollarAmount(rewardsAmount);
    const total =  formatDollarAmount(stakedAmount + availableAmount + rewardsAmount)


    const assetsSummaryData: AssetSummary[] = [
        {
            icon: '/stakedamount.png',
            alt: 'stake',
            type: 'Staked Amount',
            amount: staked,
        },
        {
            icon: '/rewards.png',
            alt: 'rewards',
            type: 'Rewards',
            amount: rewards,
        },
        {
            icon: '/avbal.png',
            alt: 'available',
            type: 'Available',
            amount: available,
        }, {
            icon: '/unbonding.png',
            alt: 'total',
            type: 'Total',
            amount: total,
        }
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
                                    {data.amount}
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
