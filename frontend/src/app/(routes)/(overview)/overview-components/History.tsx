import React from 'react';
import SideAd from './SideAd';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
import TopNav from '@/components/TopNav';

const History = ({ chainIDs }: { chainIDs: string[] }) => {
  return (
    <div className="right-section">
      <TopNav />

      <Balance chainIDs={chainIDs} />
      <SideAd />
      <RecentTransactions />
    </div>
  );
};

export default History;

const Balance = ({ chainIDs }: { chainIDs: string[] }) => {
  const [staked, available, rewards] = useGetAssetsAmount(chainIDs);
  return (
    <div>
      <div className="text-white text-center my-6">
        <span className="text-[32px] leading-normal font-bold">
          {formatDollarAmount(staked + available + rewards)}
        </span>
      </div>
      <div className="flex justify-between">
        <button className="primary-action-btn">Send</button>
        <button className="primary-action-btn">Delegate</button>
      </div>
    </div>
  );
};

const RecentTransactions = () => {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-md font-bold leading-normal">
          Recent Transactions
        </h2>
        <div className="text-[#9C9C9C] cursor-pointer text-sm font-extralight leading-normal underline underline-offset-2">
          View All
        </div>
      </div>
      <div className="text-white h-full w-full text-center pt-20">
        coming soon...
      </div>
    </div>
  );
};

// const RecentTransactionItem = () => {
//   return (
//     <div className="h-[60px] px-2 flex gap-4 items-center cursor-pointer hover:bg-[#1F184E] rounded-lg">
//       <div className="recent-txn-item-icon w-10 h-10 flex justify-center items-center">
//         <Image src="/send-icon.svg" height={24} width={24} alt="Sent" />
//       </div>
//       <div className="text-sm">
//         <div className="text-white">Sent 1 Atom to cosmos1le7v2...</div>
//         <div className="text-[#FFFFFF80]">10 mins ago</div>
//       </div>
//     </div>
//   );
// };
