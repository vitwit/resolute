import React from "react";
import Image from "next/image";

const StakingCards = () => {
  const networksData = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="staking-grid">
      {networksData.map((index: number, id: number) => (
        <div className="staking-grid-card" key={id}>
          <div className="space-y-10 w-full">
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-2">
                <Image
                  src="/validator.png"
                  width={32}
                  height={32}
                  alt="validator.."
                ></Image>
                <div className="staking-card-title">Stakefish</div>
              </div>
              <Image
                src="/network.png"
                width={32}
                height={32}
                alt="validator.."
              ></Image>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="staking-card-content-heading">
                    Staked Amount
                  </div>
                  <div className="staking-card-content">$2.30</div>
                </div>
                <div className="space-y-2">
                  <div className="staking-card-content-heading">Rewards</div>
                  <div className="staking-card-content">2 AKT</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="staking-card-content-heading">Commission</div>
                <div className="staking-card-content">30%</div>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="custom-btn">Claim</button>
              <button className="custom-btn">Claim&Stake</button>
              <Image
                className="cursor-pointer"
                src="/vector.svg"
                width={2.753}
                height={18}
                alt="validator.."
              ></Image>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StakingCards;
