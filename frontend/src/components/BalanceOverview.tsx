import React from "react";

const BalanceOverview = () => {
  return (
    <div className="details-overview-card">
      <div className="space-y-6">
        <div className="balance-title">Available Balance</div>
        <div className="balance-amount"> $ 0.43</div>
      </div>
      <div className="flex items-end space-x-9 justify-end w-[690px]">
        <div className="space-y-4">
          <div className="balance-title-1">Staked balance</div>
          <div className="balance-amount-1">$ 0.43</div>
        </div>
        <div className="space-y-4">
          <div className="balance-title-1">Rewards</div>
          <div className="balance-amount-1">$ 0.43</div>
        </div>
        <div className="space-y-4">
          <div className="balance-title-1">Wallet Balance</div>
          <div className="balance-amount-1">$ 0.43</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceOverview;
