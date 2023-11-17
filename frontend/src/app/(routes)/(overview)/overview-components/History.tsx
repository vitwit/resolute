import Image from 'next/image';
import React from 'react';
import SideAd from './SideAd';

const History = () => {
  return (
    <div className="right-section">
      <SelectNetwork />
      <Balance />
      <SideAd />
      <RecentTransactions />
    </div>
  );
};

export default History;

const SelectNetwork = () => {
  return (
    <div>
      <div className="flex gap-2 items-center cursor-pointer">
        <Image
          src="/all-networks-icon.png"
          height={36}
          width={36}
          alt="All Networks"
        />
        <div className="text-md font-medium leading-normal text-white">
          All Networks
        </div>
        <div>
          <Image
            src="/drop-down-icon.svg"
            height={16}
            width={16}
            alt="Select Network"
          />
        </div>
      </div>
    </div>
  );
};

const Balance = () => {
  return (
    <div>
      <div className="text-white text-center my-6">
        <span className="text-[32px] leading-normal font-bold">45345 </span>
        <span className="text-sm leading-normal">OSMO</span>
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
