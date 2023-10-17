import React from "react";
import Image from "next/image";
const StakedAmountWithActions = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <Image src="/money.png" width={70} height={70} alt="stake.."></Image>
          <div className="space-y-3 justify-center items-start">
            <div className="staking-amount">$ 0.43</div>
            <div className="staking-amount-heading">Staked Balance</div>
          </div>
        </div>
        <div className="flex space-x-10 items-center">
        <div><button className="customBtn">Claim All</button></div>
        <div><button className="customBtn">Stake All</button></div>
        <div><button className="customBtn">Delegate</button></div>
          
        </div>
      </div>

      <div className="h-line"></div>
    </div>
  );
};

export default StakedAmountWithActions;
